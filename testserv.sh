start() {
    if test -f "package.json"; then
        if grep -q "\"dev\"" "package.json"; then
            yarn dev
        elif grep -q "\"start:dev\"" "package.json"; then
            yarn start:dev
        elif grep -q "\"start:all\"" "package.json"; then
            yarn start:all
        else
            yarn start
        fi
    else
        echo "Missing package.json"
    fi
}

alias sta=start

sta

sleep 100
