# Notion widget for Android  
## Video Demo:
https://youtube.com/
## Description:
A simple app that contains a widget for you to display custom Notion databases straight on your homescreen!
* Add items
* Open items
* Switch status
* Change dates

![Widget preview](assets/images/taskw.png)

<details>
<summary>

## Code breakdown
</summary>

### Framework:
For this project I used the React Native framework to create the app. I had watched a lot of reviews on frameworks, and ultimatly found React Native to be the most well documented and best long term skill to learn. However, I definitely was not ready for the journey ahead of me, as I have never touched a single line of HTML or Javascript before. When I say CS50 was my first experience with coding, it really was. 
This definitely was not possible without the [React Native Android Widget library](https://saleksovski.github.io/react-native-android-widget/) from Stefan Aleksoski. Online tutorials already brought me really far, but there had always been videos where they forced a certain library or framework onto you. Me, being a 
#### `index.tsx`
### Widget:
#### `widget-task-handler.tsx`
#### `widget.tsx`
This file lays out the structure and overall shape of the widget UI. The Android Widget library made this super simple by exporting custom components that work similar to tsx (and HTML in that regard). I first had to define the types as to avoid typescript yelling at me, I had to create a custom type/interface called task for all the properties I would like to display or use in the final widget:

``` interface Task {
  id: string;
  title: string;
  color: string;
  status: string;
}
```

#### `app.config.ts`
This file contains all the widget parameters which will then get converted into native code for Android to understand. It contains the name, size, description, preview. Basically, the actual part that makes it able to add onto the homescreen. As I had used Expo to create this project, I had to define it as a plugin in order for it to have native functionality. The cool thing with Expo is that whenever I made a mistake or change a small feature, it can get updated automatically (hot reloading), without having to rebuild the entire project. 

### Notion:
#### `api.ts`
This file is basically the backbone of the entire project, and the most tiresome. I had to watch multiple videos and then had to find a way to tie it all together. I had 
#### `configure.tsx`

</details>

 ## Final thoughts:
 The reason I chose this idea to create was because I wanted to create something I might use myself in the future. A productivity tool 
 I had just started my final year of highschool, which meant which was why this project was on hold for so long, but the voice in the back of my mind nagging me to finish what I had started never left. I knew I had already fought through the hardest part of the course (damn you, pointers!) 
