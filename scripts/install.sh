#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/../

# ./scripts/provision/run.sh

# # Dependencies
# #
# npm install

# ln -sf $SCRIPT_DIR/aww.sh /usr/local/bin/aww

read -p "You can invoke the aww commands using the 'aww' keyword e.g. 'aww up all' or 'aww status'.\nHowever, for convenience some developers prefer 'p' (for Penneo).\nWould you also like to invoke aww commands using 'p' e.g. 'p up all' or 'p status'? (y/n)? " choice

case "$choice" in
    y|Y )
        ln -sf $SCRIPT_DIR/aww.sh /usr/local/bin/p
        echo "Special command 'p' is installed."
        ;;
    n|N )
        echo "Special command 'p' is not installed."
        ;;
    * )
        echo "Invalid choice. Special command 'p' is not installed."
        ;;
esac
