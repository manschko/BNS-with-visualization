package com.codingchallenge.binarysearchtree.models;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Traverse {

   /* public static void inorder(Tree tree) {
        if (!tree.empty()){
            inorder (tree.left());
            System.out.println(tree.value());
            inorder (tree.right());
        }
    }

    public static void preorder(Tree tree) {
        if (!tree.empty()) {
            System.out.println(tree.value());
            preorder(tree.left());
            preorder(tree.right());
        }
    }

    public static void postorder(Tree tree) {
        if (!tree.empty()){
            postorder(tree.left());
            postorder(tree.right());
            System.out.println(tree.value());
        }
    }*/

    public static Node getMax(Node n){
        if(n.right != null){
            return getMax(n.right);
        }else{
            return n;
        }
    }

    public static Node getMin(Node n){
        if(n.left != null){
            return getMin(n.left);
        }else{
            return n;
        }
    }

    //travers for UI
    public static List<Integer> printTree(Node tmpRoot) {

        int depth = 0;
        List<Integer> data = new LinkedList<>();
        Queue<Node> currentLevel = new LinkedList<Node>();
        Queue<Node> nextLevel = new LinkedList<Node>();

        currentLevel.add(tmpRoot);

        while (!currentLevel.isEmpty()) {
            Iterator<Node> iter = currentLevel.iterator();
            while (iter.hasNext()) {
                Node currentNode = iter.next();
                if (currentNode.left != null) {
                    nextLevel.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    nextLevel.add(currentNode.right);
                }
                data.add(currentNode.content);
            }
            depth++;
            currentLevel = nextLevel;
            nextLevel = new LinkedList<Node>();
        }
        data.add(depth);
        data.add(getMax(tmpRoot).content);
        data.add(getMin(tmpRoot).content);
        return data;
    }

}
