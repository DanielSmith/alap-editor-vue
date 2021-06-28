# Alap Editor - Vue Version

This is an editor for link items to be used by Alap.  Alap enables attaching menus to anchors or images on a web page.  The idea is to dynamically provide choice as to where a link will go, as opposed to be limited to one target.

The editor is a DEMO for now.  Alap is driven by a configuration object that defines the label, url, and tags for each menu item.

I made a short [YouTube Video](https://youtu.be/vWEbmBLiQaA) about this.

![image](https://user-images.githubusercontent.com/167197/123692021-5156d700-d824-11eb-8fa2-2f75945e2945.png)

## More info:
- [https://editor-vue.alap.info/](https://editor-vue.alap.info/) - this editor
- [https://alap.info/](https://alap.info/) - Alap demo
- [https://github.com/DanielSmith/alap](https://github.com/DanielSmith/alap) - Alap repo
- [dev.to Article](https://dev.to/danielsmith/alap-menus-for-links-5e95) - alap - Menus For Links
  

## Features

- Drag and Drop links in, to extract some site infromation
- Interactively test item IDs and tags on a sample link
- Create items from scratch
- Easy to clone existing items
- Prevent same-name duplicate items
- Search filters the list of items

## Requirements

My enviroment is using:
* Vite
* Vue3 with Pinia
* Netlify account, with `Netlify-cli` for local development
* FaunaDB, with an API key.  Not strictly required at this time.

## Installation 

clone the alap-editor-vue repo, and run the commmands

```bash
  cd alap-editor-vue
  npm install
  netlify dev

  # or if not using drag and drop links:
  npm run dev
```
    
## Tech Stack and some comments....

**Client:** Vite, Vue 3, Pinia, TailwindCSS

**Server:** Netlify functions (Lambda), FaunaDB

This is an exploratory demo that is not meant to save edits from session to session.

At the moment, I am not really taking full advantage of GraphQL.  I want it to be easy to approach the "update, or create if it doesn't exist" idea.  I've decided I will use FQL for this, but I want to write the React client first.

Other ideas for DB: mLab, Firebase, or DynamoDB.

I've learned things from doing this Vue version that will inform how I do the React client. 

## Acknowledgements

 - [James Q Quick - JAMstack demo](https://github.com/jamesqquick/JAMstack-Crash-Course-Build-a-Fullstack-App-with-React-Serverless-and-FaunaDB) - got some GraphQL insight from this one

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  
