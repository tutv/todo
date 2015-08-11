# HTML5 standard template

* HTML5
* LESS/CSS3
* Bootstrap
* Font Awesome
* Jquery


## Install Grunt to compile LESS files to CSS

### 1. Install & config

#### a. Install **Node.js**

Download at https://nodejs.org & install it.

#### b. Install **Gruntjs**

`npm install -g grunt-cli`

#### c. Install **grunt-contrib-less, grunt-contrib-watch, jit-grun**

`npm install grunt grunt-contrib-less grunt-contrib-watch jit-grunt --save-dev`

#### d. Config `Gruntfile.js`

```
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "assets/css/style.css": "assets/less/style.less" // destination file and source file
                }
            }
        },
        watch: {
            styles: {
                files: ['assets/less/**/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.registerTask('default', ['less', 'watch']);
};
```

### 2. Run grunt

``grunt``