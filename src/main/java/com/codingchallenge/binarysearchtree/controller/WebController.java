package com.codingchallenge.binarysearchtree.controller;

import com.codingchallenge.binarysearchtree.models.Traverse;
import com.codingchallenge.binarysearchtree.models.Tree;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Scanner;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "upload";
    }

    @PostMapping("/tree")
    public String upload(@RequestParam("file") MultipartFile file, @RequestParam(value = "default", defaultValue = "false") boolean dummy, Model model) {
        Tree tree = new Tree();
        Scanner scanner = null;
        if(!dummy){
            try {
                scanner = new Scanner(file.getInputStream());
            }catch(Exception e) {
                e.printStackTrace(System.out);
            }
        }else {
            try {
                FileReader from = new FileReader("src/main/resources/dummy.csv");
                scanner = new Scanner(from);
            }catch(Exception e) {
                e.printStackTrace(System.out);
            }
        }

        tree = getTreeFromScannner(scanner);

        model.addAttribute("data", Traverse.printTree(tree.root));
        return "index";
    }

    @GetMapping("/tree")
    public String upload(Model model) {
        Tree tree = new Tree();
        Scanner scanner = null;
        try {
            FileReader from = new FileReader("src/main/resources/dummy.csv");
            scanner = new Scanner(from);
        }catch(Exception e) {
            e.printStackTrace(System.out);
        }
        tree = getTreeFromScannner(scanner);

        model.addAttribute("data", Traverse.printTree(tree.root));
        return "index";
    }

    Tree getTreeFromScannner(Scanner scanner){
        Tree tree = new Tree();
        String temp;
        while (scanner.hasNext()) {
            temp = scanner.nextLine();
            tree.insert(Integer.parseInt(temp.replace(",", "")));

        }
        return tree;
    }
}
