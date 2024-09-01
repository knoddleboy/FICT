#!/bin/bash

while getopts ":p:" opt; do
  case $opt in
    p) num_processors=$OPTARG ;;
    \?) echo "Invalid option: -$OPTARG" >&2
        exit 1 ;;
    :) echo "Option -$OPTARG requires an argument." >&2
        exit 1 ;;
  esac
done

shift "$((OPTIND - 1))"
class_name=$1

if [ -z "$num_processors" ] || [ -z "$class_name" ]; then
  echo "Usage: $0 -p <num_processors> <class_name>"
  exit 1
fi

javac -cp .:$MPJ_HOME/lib/mpj.jar *.java

mpjrun.sh -np $num_processors $class_name

# javac -cp .:$MPJ_HOME/lib/mpj.jar *.java && mpjrun.sh -np 4 MultiplyBlocking