# Jutsu website

A gulp script that generates a common website structure based on
[Bootstrap 3](http://getbootstrap.com/), and uses [Nunjucks](https://mozilla.github.io/nunjucks/) to compile the project from its templates, has the hability to include CSS spriting,
Macros and predefined graphics placeholders, could be used to create a small
website just HTML based or to rapidly create a wireframe/prototype usable by
any designer or client.  

Needs npm and gulp to compile, to start you need to execute:

```
npm install
gulp
```

This instructions will generate the basic info in HTML format in the a folder called html.

## Serving files
After having all setup, you can load a small server with:

```
gulp serve
```

This will monitor any changes and update the folder as needed, including the
browser reload.

## Creating pages
Creating a new page is as simple as creating a new file in the app/pages folder,
by default it will get all the structure defined in "apps/templates/layout.nujuncks"
file, but we can define or add extra characteristics as needed.

There's a JSON file in the apps folder called "data.json" that allows setting up
variables that can be used inside the templates, there's also a individual process
that allows setting up variables per page, as the page title, filename and such.

This can be easily extended and adapted to any new project.

## Sprite CSS
If you want to optimize your CSS and images, you can add any image you'll
require for as icons, logos and the script will automatically convert them
to a single image CSS sprite, available to use inside any part of the site.

You need to copy your image to the app/sprites folder, the image name will be
used as part of the css class name.  


# License
All components are released under [GPL 3.0](https://www.gnu.org/licenses/gpl.txt).
