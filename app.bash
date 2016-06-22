#! /bin/bash
# WebApp main script

# stop script if an error occurs
set -e
# current path
CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# App Name
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

# check args
if [ "$*" = "" ]; then
	scriptHelp
fi

if [ $1 = "npm-global" ]; then

	echo -e "\033[95mUpdating npm global packages... \033[0m"

	#modules instalation
	sudo npm install -g $NPM_GLOBAL_DEPENDENCIES

elif [ $1 = "npm" ]; then

	echo -e "\033[95mUpdating npm project packages... \033[0m"

	if [ "$2" = "-u" ]; then
		echo -e "\033[95mChecking for updates... \033[0m"
		npm-check -u
	fi

	#package instalation (sudo is not required for OSX)
	if [ "$(uname)" == "Darwin" ]; then
		npm install
		npm prune
	else
		sudo npm install
		sudo npm prune
	fi

elif [ $1 = "watch" ]; then

	echo -e "\033[95mRunning gulp watch task... \033[0m"
	gulp watch

elif [ $1 = "build" ]; then

	bash app.bash clean

	echo -e "\033[95mRunning gulp build task... \033[0m"
	gulp build

	# task done!
	echo -e "\033[92mDone! \033[0m"

elif [ $1 = "clean" ]; then

	echo -e "\033[95mCleaning dist folder... \033[0m"

	#clean dist folder
	rm -rf $DIST_PATH

	# task done!
	echo -e "\033[92mDone! \033[0m"

else
	echo -e "\033[31mInvalid command\033[0m"
fi
