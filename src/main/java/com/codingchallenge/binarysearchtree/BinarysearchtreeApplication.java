package com.codingchallenge.binarysearchtree;

import com.codingchallenge.binarysearchtree.models.Traverse;
import com.codingchallenge.binarysearchtree.models.Tree;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileReader;
import java.util.Scanner;

@SpringBootApplication
public class BinarysearchtreeApplication {

    public static void main(String[] args) {

        SpringApplication.run(BinarysearchtreeApplication.class, args);
        //test();
    }

    /*private static void test() {
        Tree tree = new Tree();
        try {
            FileReader from = new FileReader("src/main/resources/dummy.csv");
            Scanner scanner = new Scanner(from);
            String temp;
            while (scanner.hasNext()) {
                temp = scanner.nextLine();
                if (temp.equals("1075,"))
                    System.out.println("hit");
                tree.insert(Integer.parseInt(temp.replace(",", "")));

            }
            Traverse.printTree(tree.root);
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
    }*/

}
