.PHONY: checkstyle
checkstyle: node_modules
	@./node_modules/.bin/jshint scripts/*.js --config scripts/.jshintrc

.PHONY: clean
clean:
	@rm -rf node_modules/

node_modules:
	@npm install
