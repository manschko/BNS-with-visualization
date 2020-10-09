package com.codingchallenge.binarysearchtree.models;

public class Node {

    Integer height;
    Integer content;
    Node left, right;

    public Node(Object object) {
        content = (Integer) object;
        left = right = null;
        height = 0;
    }

    public Node() {
        content = null;
        left = right = null;
        height = 0;
    }
}
