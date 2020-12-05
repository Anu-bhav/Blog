#!/usr/bin/env bash

function blog(){
    blog_path="/d/Documents/Development/website_github/Portfolio-Blog/src/routes/blog/posts/test"
    static_path="/d/Documents/Development/website_github/Portfolio-Blog/static/test"
    backup_dir="/d/Documents/Development/website_github/Posts/test"
    cd $blog_path || return
    chmod 777 $blog_path/*
    
    FILE="$1.md"
    template="hello-world.md"
    
    if [ ! -f "$FILE" ]; then
        cp $template "$FILE"
        sed -i "s/title: .*/title: title/" "$FILE"
        today=$(date -u +"%Y-%m-%d")
        sed -i "s/date: \"2020-12-02\"/date: $today/" "$FILE"
        sed -i "s/Every .*/description/" "$FILE"
        eval "$(/d/Program\ Files/Typora/Typora.exe "$FILE" > /dev/null 2>&1)"
    else
        eval "$(/d/Program\ Files/Typora/Typora.exe "$FILE" > /dev/null 2>&1)"
    fi
    
    cp "$FILE" $backup_dir && echo "Successfully copied $FILE to backup_dir" || echo "No such file created"
    
    blog_img_dir=$(find "$blog_path" ! -path "$blog_path" -type d)
    
    if [ -d "$blog_img_dir" ]; then
        cp -afr "$blog_img_dir" $static_path && echo "Successfully copied blog_img_dir to static_path"
        cp -afr "$blog_img_dir" $backup_dir && echo "Successfully copied blog_img_dir to backup_dir"
        rm -rf "$blog_img_dir" && echo "Successfully deleted blog_img_dir from blog_path"
    fi
    
    cd - > /dev/null 2>&1 || return
}
