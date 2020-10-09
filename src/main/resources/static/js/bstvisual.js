'use strict';

function printDate(data) {
    console.log(data[data.length - 3])
    if (data[data.length - 3] <= 7) {
        model.animationSpeed.speed = 200;

    }
    alert("Max = " + data[data.length - 2] + " Min = " + data[data.length - 1])
    model.pixelOffset = Math.pow(2, data[data.length - 3] - 1) * (bstNode.prototype.size / 1.5)
    //Math.pow(2.6, (data[data.length-3]-1));
    for (let i = 0; i < data.length - 3; i++) {
        presenter.addNode(data[i], 1);
    }
}

// https://jsfiddle.net/briguy37/2MVFd/
function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'Nxxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

let bstNode = function (value) {
    this.value = value;

    this.id = generateUUID();
}

bstNode.prototype.leftNode = null;
bstNode.prototype.rightNode = null;
bstNode.prototype.parent = null;
bstNode.prototype.locX = null;
bstNode.prototype.locY = 50;
bstNode.prototype.depth = 0;
bstNode.prototype.inRightBranch = true;
bstNode.prototype.xOffset = 1;

bstNode.prototype.size = 30;
bstNode.prototype.fillStyle = '#b2cfff';
bstNode.prototype.fillStyleText = '#000';

bstNode.prototype.children = function () {
    let children = [];
    if (this.leftNode) {
        children.push(this.leftNode);
    }
    if (this.rightNode) {
        children.push(this.rightNode);
    }
    return children;
}

bstNode.prototype.allChildren = function () {
    let children = [];
    if (this.leftNode) {
        children.push(this.leftNode);
        $.each(this.leftNode.allChildren(), function (index, child) {
            children.push(child);
        })
    }
    if (this.rightNode) {
        children.push(this.rightNode);
        $.each(this.rightNode.allChildren(), function (index, child) {
            children.push(child);
        })
    }
    return children;
}

function printTree() {
    let leftNodeVal, rightNodeVal;
    if (rootNode.leftNode) {
        leftNodeVal = rootNode.leftNode.value;
    }
    if (rootNode.rightNode) {
        rightNodeVal = rootNode.rightNode.value;
    }
    console.log(rootNode.value, 'Left Node: ' + leftNodeVal, 'Right Node: ' + rightNodeVal);
    $.each(rootNode.allChildren(), function (index, node) {
        let leftNodeVal, rightNodeVal;
        if (node.leftNode) {
            leftNodeVal = node.leftNode.value;
        }
        if (node.rightNode) {
            rightNodeVal = node.rightNode.value;
        }
        console.log(node.value, 'Left Node: ' + leftNodeVal, 'Right Node: ' + rightNodeVal);
    })
}

let rootNode = null;

let model = {
    'pixelOffset': null,
    'nodesToAnimate': [],
    'animationSpeed': {'speed': 0, 'delay': 0, noAnimation: false}
}

let presenter = {
    'addNode': function (value, numbersToAdd) {
        let node = new bstNode(value);
        if (!rootNode) {
            rootNode = node;
            node.locX = $('#svg').width() / 2;
        } else {
            let parentNode = presenter.findParentFromValue(rootNode, value);
            node.depth = parentNode.depth + 1;
            node.parent = parentNode;
            presenter.addToParent(node);
        }
        model.nodesToAnimate.push([{'node': node, 'animationType': 'add'}])
        view.animateNodes(presenter.returnNodesToAnimate(), numbersToAdd);
    },

    'addToParent': function (node) {
        if (node.parent) {
            let parentNode = node.parent, pixelOffset = model.pixelOffset;

            if (node.value >= parentNode.value) {
                parentNode.rightNode = node;
                node.locX = parentNode.locX + pixelOffset / Math.pow(2, node.depth - 1);
            } else {
                parentNode.leftNode = node;
                node.locX = parentNode.locX - pixelOffset / Math.pow(2, node.depth - 1);
            }
            node.locY = rootNode.locY + 200 * node.depth;
        }

        function fixCollisions(nodeToCheck) {
            let closeness = 2;
            $.each(rootNode.allChildren(), function (index, node) {
                if (nodeToCheck !== node && nodeToCheck.locY == node.locY &&
                    (Math.abs(nodeToCheck.locX - node.locX) < closeness * node.size)) {
                    nodeToCheck.locX += Math.sign(nodeToCheck.locX - node.locX) * closeness / 2 * nodeToCheck.size;
                    node.locX += Math.sign(node.locX - nodeToCheck.locX) * closeness / 2 * nodeToCheck.size;
                    let childNodesToAnimate = []
                    childNodesToAnimate.push({
                        'node': node, 'animationType': 'move',
                        'x': node.locX, 'y': node.locY, 'lineAnimation': {
                            'x1': node.parent.locX - node.locX,
                            'y1': node.parent.locY - node.locY, 'x2': 0, 'y2': 0
                        }
                    })
                    $.each(node.children(), function (index, node) {
                        childNodesToAnimate.push({
                            'node': node, 'animationType': 'move',
                            'x': node.locX, 'y': node.locY, 'lineAnimation': {
                                'x1': node.parent.locX - node.locX,
                                'y1': node.parent.locY - node.locY, 'x2': 0, 'y2': 0
                            }
                        });
                    });

                    if (childNodesToAnimate.length > 0) {
                        model.nodesToAnimate.push(childNodesToAnimate);
                    }
                }
            });
        }

        fixCollisions(node);
    },

    'searchForNode': function (value) {
        let node;
        if (rootNode) {
            node = presenter.searchDownTree(rootNode, value);
        }
        if (node && node.value == value) {
            let i = 0;
            while (i < 2) {
                model.nodesToAnimate.push([{'node': node, 'animationType': 'pop'}]); // add Node to list 2x, will animate 3x
                i++;
            }
            return node;
        } else {
            model.nodesToAnimate = [];
            alert('The value ' + String(value) + ' does not exist in the tree.');
        }
    },

    'searchDownTree': function (node, value) {
        model.nodesToAnimate.push([{'node': node, 'animationType': 'pop'}]);
        if (value == node.value) {
            return node;
        } else if (value < node.value) {
            if (node.leftNode == null) {
                return null;
            } else {
                return presenter.searchDownTree(node.leftNode, value);
            }
        } else if (value > node.value) {
            if (node.rightNode == null) {
                return null;
            } else {
                return presenter.searchDownTree(node.rightNode, value);
            }
        }
        return false;
    },

    'findParentFromValue': function (node, value) {
        model.nodesToAnimate.push([{'node': node, 'animationType': 'pop'}]);
        if (value < node.value) {
            if (!node.leftNode) {
                return node;
            } else {
                return presenter.findParentFromValue(node.leftNode, value);
            }
        } else {
            if (!node.rightNode) {
                return node;
            } else {
                return presenter.findParentFromValue(node.rightNode, value);
            }
        }
    },

    'returnNodesToAnimate': function () {
        return model.nodesToAnimate;
    },

    'returnAnimationSpeed': function () {
        return model.animationSpeed;
    },

    'returnChildren': function (node) {
        return node.children();
    }
}

let view = {
    'addNode': function (numbersToAdd) {
        if (numbersToAdd) {
            value = numbersToAdd.pop();
        } else {
            let input = $('#addNode'), value = Number(input.val());
            input.val('');
        }

        if (view.checkForBadValue(value)) {
            return;
        }
        presenter.addNode(value, numbersToAdd);
    },

    'draw': function () {

        svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');

    },

    'drawNode': function (node) {

        let newNode = svg.insert('g', ':first-child')
            .attr({'class': 'node', 'id': node.id})
            .attr('transform', 'translate(' + node.locX + ',' + node.locY + ')');

        view.drawConnection(node.parent, node);

        let nodeWrap = newNode.append('g').attr({'class': 'nodeWrap', 'transform': 'scale(0)'});

        nodeWrap.append('circle')
            .attr('r', node.size)
            .style({'fill': node.fillStyle, 'stroke': node.fillStyleText, 'stroke-width': 2});

        nodeWrap.append('text')
            .attr('dx', '0')
            .attr('dy', '.35em')
            .text(node.value);

        return nodeWrap;

    },

    'drawConnection': function (node, childNode) {
        if (node) {
            d3.select('#' + childNode.id).insert('line', ':first-child')
                .attr({
                    'x1': node.locX - childNode.locX, 'y1': node.locY - childNode.locY, 'x2': 0,
                    'y2': 0, 'class': 'nodeLine'
                });
        }

    },

    'animateNodes': function (nodesToAnimate, numbersToAdd) {
        let animationSpeed = presenter.returnAnimationSpeed();
        let speed = animationSpeed.speed;

        let animate = {
            'pop': function (animation) {
                if (animationSpeed.noAnimation) {
                    endOfTransitions();
                } else {
                    d3.select('#' + animation.node.id + ' > .nodeWrap')
                        .transition()
                        .attr('transform', 'scale(1.5)')
                        .duration(speed)
                        .transition()
                        .attr('transform', 'scale(1)')
                        .duration(speed)
                        .transition()
                        .attr('transform', null)
                        .duration(0)
                        .each('end', endOfTransitions);
                }
            },

            'delete': function (animation) {
                d3.select('#' + animation.node.id + ' > .nodeWrap')
                    .transition()
                    .attr('transform', 'scale(0)')
                    .duration(speed)
                    .each('end', function () {
                        $('#' + animation.node.id + ' > .nodeLine').remove();
                        $.each(presenter.returnChildren(animation.node), function (index, node) {
                            $('#' + node.id + ' > .nodeLine').remove();
                        })
                        if (!(animation.hide)) {
                            $('#' + animation.node.id).remove();
                        }
                        endOfTransitions();
                    });
            },

            'move': function (animation) {
                if (animation.node.parent) {
                    $('#' + animation.node.id).insertBefore($('#' + animation.node.parent.id));
                } else {
                    $('#' + animation.node.id).appendTo('#svg > g > g');
                }
                if (animation.removeConnection) {
                    $('#' + animation.node.id + ' > .nodeLine').remove();
                    $.each(presenter.returnChildren(animation.node), function (index, node) {
                        $('#' + node.id + ' > .nodeLine').remove();
                    })
                }
                d3.select('#' + animation.node.id).transition()
                    .attr('transform', 'translate(' + animation.x + ',' + animation.y + ')')
                    .duration(speed)
                    .each('end', function () {
                        if (animation.drawConnection) {
                            view.drawConnection(animation.node.parent, animation.node);
                        }
                        endOfTransitions();
                    });
                if (animation.lineAnimation) {
                    d3.select('#' + animation.node.id + ' > .nodeLine').transition()
                        .attr({
                            'x1': animation.lineAnimation.x1, 'y1': animation.lineAnimation.y1,
                            'x2': animation.lineAnimation.x2, 'y2': animation.lineAnimation.y2
                        })
                        .duration(speed)
                }
            },

            'unhide': function (animation) {
                d3.select('#' + animation.node.id + ' > .nodeWrap')
                    .attr('transform', 'scale(1)');
                if (animation.drawConnection) {
                    view.drawConnection(animation.node.parent, animation.node);
                }
                if (animation.drawChildrenConnection) {
                    $.each(presenter.returnChildren(animation.node), function (index, node) {
                        view.drawConnection(node.parent, node);
                    })
                }
                if (animation.newValue) {
                    d3.select('#' + animation.node.id + ' > .nodeWrap > text')
                        .text(animation.node.value);
                }
                endOfTransitions();
            },

            'hide': function (animation) {
                $('#' + animation.node.id).hide();

                endOfTransitions();
            },

            'add': function (animation) {
                let nodeWrap = view.drawNode(animation.node);
                nodeWrap.transition()
                    .attr('transform', 'scale(1)')
                    .duration(speed)
                    .each('end', endOfTransitions);
            }
        }

        function endOfTransitions() {
            nodesToAnimate[0].pop()
            if (nodesToAnimate[0].length == 0) {
                nodesToAnimate.shift();
                animateNextNode();
            }
        }

        function animateAllNodesInSublist(nodesToAnimate) {
            $.each(nodesToAnimate[0], function (index, child) {
                animationSpeed = presenter.returnAnimationSpeed();
                speed = animationSpeed.speed;
                animate[child.animationType](child);
            })
        }

        function animateNextNode() {
            if (nodesToAnimate.length > 0) {
                animateAllNodesInSublist(nodesToAnimate);
            } else {
                setTimeout(function () {
                    if (numbersToAdd && numbersToAdd[0]) {
                        view.addNode(numbersToAdd);
                    }
                }, animationSpeed.delay)
            }
        }

        animateNextNode();
    },

    'searchForNode': function () {
        let input = $('#searchForNode'), value = Number(input.val());
        if (view.checkForBadValue(value)) {
            return;
        }
        if (presenter.returnAnimationSpeed().noAnimation) {
            alert("Please turn on animation to find a node.");
            return;
        }
        input.val('');

        presenter.searchForNode(value);
        view.animateNodes(presenter.returnNodesToAnimate(), null, null);
    },

    'checkForBadValue': function (value) {
        if (isNaN(value)) {
            alert('Please enter a value.');
            return true;
        }
        return false;
    }
}

let zoomHandler = d3.behavior.zoom().scaleExtent([0, 1000]).on('zoom', view.draw);
let svg = d3.select('#svg')
    .call(zoomHandler)
    .append('g')
    .append('g');



