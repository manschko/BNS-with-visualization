package com.codingchallenge.binarysearchtree.controller;

import com.codingchallenge.binarysearchtree.models.Traverse;
import com.codingchallenge.binarysearchtree.models.Tree;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileReader;
import java.util.Scanner;

@Controller
public class WebController {

    Logger logger = LoggerFactory.getLogger(WebController.class);

    @GetMapping("/")
    public String index() {
        return "upload";
    }

    @PostMapping("/tree")
    public String upload(@RequestParam("file") MultipartFile file, @RequestParam(value = "default", defaultValue = "false") boolean dummy, Model model) {
        Scanner scanner = null;
        if (!dummy) {
            try {
                scanner = new Scanner(file.getInputStream());
            } catch (Exception e) {
                logger.debug(e.getMessage());
            }
        } else {
            try {
                FileReader from = new FileReader("src/main/resources/dummy.csv");
                scanner = new Scanner(from);
            } catch (Exception e) {
                logger.error(e.getMessage());

            }
        }

        Tree tree = getTreeFromScannner(scanner);

        model.addAttribute("data", Traverse.printTree(tree.root));
        return "index";
    }

    @GetMapping("/tree")
    public String upload(Model model) {
        Scanner scanner = null;
        try {
            FileReader from = new FileReader("src/main/resources/dummy.csv");
            scanner = new Scanner(from);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        Tree tree = getTreeFromScannner(scanner);

        model.addAttribute("data", Traverse.printTree(tree.root));
        return "index";
    }

    Tree getTreeFromScannner(Scanner scanner) {
        Tree tree = new Tree();
        String temp;
        while (scanner.hasNext()) {
            temp = scanner.nextLine();
            tree.insert(Integer.parseInt(temp.replace(",", "")));

        }
        return tree;
    }
}
