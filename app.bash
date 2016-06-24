#! /bin/bash
# WebApp main script

# stop script if an exception occurs
set -e

# current path
CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# get app Name
APP_NAME=${PWD##*/}
APP_NAME="${APP_NAME/-webapp/}"

# components paths
DIST_PATH=$CURRENT_PATH"/dist/"

# npm dependencies
NPM_GLOBAL_DEPENDENCIES="gulp npm-check eslint"

# help output
scriptHelp() {
	echo -e "\033[93m"$APP_NAME" webapp script\nCommands:\033[0m"
	echo -e "\033[95m npm-global: Installs or updates global npm dependencies.\033[0m"
	echo -e "\033[95m npm: Update project npm dependencies. Use -u for package updates. \033[0m"
	echo -e "\033[95m watch: Runs gulp watcher daemon.\033[0m"
	echo -e "\033[95m build: Builds app release for distribution.\033[0m"
	echo -e "\033[95m clean: Cleans dist folder.\033[0m"
	exit
}


# commands
case "$1" in

npm-global)

	echo -e "\033[95mInstalling npm global dependencies... \033[0m"

	sudo npm install -g $NPM_GLOBAL_DEPENDENCIES
	;;

npm)

	echo -e "\033[95mInstalling npm project dependencies... \033[0m"

	if [ "$2" = "-u" ]; then
		echo -e "\033[95mChecking for updates... \033[0m"
		npm-check -u
	fi

	# package instalation (sudo is not required for OSX)
	if [ "$(uname)" == "Darwin" ]; then
		npm install && npm prune
	else
		sudo npm install && sudo npm prune
	fi
	;;

watch)

	echo -e "\033[95mRunning gulp watch task... \033[0m"
	gulp watch
	;;

build)

	bash app.bash clean

	echo -e "\033[95mRunning gulp build task... \033[0m"
	gulp build

	# task done!
	echo -e "\033[92mDone! \033[0m"
	;;

clean)

	echo -e "\033[95mCleaning dist folder... \033[0m"

	#clean dist folder
	rm -rf $DIST_PATH

	# task done!
	echo -e "\033[92mDone! \033[0m"
	;;

#default
*)
	scriptHelp
    ;;
esac
