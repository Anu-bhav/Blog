#!/usr/bin/env bash

function blog(){
    blog_path="/d/Documents/Development/website_github/Portfolio-Blog/src/routes/blog/posts"
    static_path="/d/Documents/Development/website_github/Portfolio-Blog/static"
    backup_dir="/d/Documents/Development/website_github/Posts"
    FILE="$blog_path"/$1
    template="$blog_path"/hello-world.md
    
    if [ ! -f $FILE ]; then
        touch $FILE.md
        cp $template $FILE.md
        sed -i "s/title: .*/title: #title#/" $FILE.md
        sed -i "s/date: \"2019-06-11T08:38:00.000Z\"/date: $(date -u +\"%Y-%m-%d\")/" $FILE.md
        sed -i "s/Every .*/#description#/" $FILE.md
        chmod 777 $blog_path/*
        # cat $FILE.md
        cd $blog_path
        $(/d/Program\ Files/Typora/Typora.exe $1.md > /dev/null 2>&1)
    else
        cd $blog_path
        $(/d/Program\ Files/Typora/Typora.exe $1 > /dev/null 2>&1)
    fi
    
    chmod 777 $blog_path/*
    # if [ -d $(find "$blog_path" ! -path "$blog_path" -type d) ]; then
    cp -afr $(find "$blog_path" ! -path "$blog_path" -type d) $static_path && echo "Successfully copied" || echo "No such directory created"
    cp -afr $(find "$blog_path" ! -path "$blog_path" -type d) $backup_dir && echo "Successfully copied" || echo "No such directory created"
    cp $FILE.md $backup_dir && echo "Successfully copied" || echo "No such file created"
    rm -rf $(find "$blog_path" ! -path "$blog_path" -type d) && echo "Successfully deleted" || echo "No such directory created"
    # fi
    cd - 2>&1
}
