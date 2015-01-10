# This file is part of goboo/jquery-client.
#
# (c) 2014,2015 Tristan Lins
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

help:
	echo "Usage:"
	echo "  make install     Install dependencies."
	echo "  make reinstall   Force reinstall dependencies."
	echo "  make clean       Clean the dist archive."
	echo "  make build       Build the dist archive."

build:
	./node_modules/.bin/gulp build

install:
	# Install NPM packages
	npm install

	# Install bower packages
	./node_modules/.bin/gulp install

	# Install other vendor packages
	mkdir -p vendor
	test -f vendor/jquery-tagit.zip || wget https://github.com/Nikku/jquery-tagit/archive/master.zip -O vendor/jquery-tagit.zip
	test -d vendor/jquery-tagit-master || unzip vendor/jquery-tagit.zip -d vendor/


reinstall:
	rm -rf bower_components node_modules vendor
	make install
