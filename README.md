# Notion widget for Android 
![Notion widget icon](assets/images/icon.png)
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
This definitely was not possible without the [React Native Android Widget library](https://saleksovski.github.io/react-native-android-widget/) from Stefan Aleksoski. Online tutorials already brought me really far, but I 
What really helped for me was to draw the design I had in my head, with every button connected to a function that returned a certain value, across multiple files. I could then break this down into subtasks which I wrote in pseudocode.
One thing I was really worried about was performance, I have always thought code should be written as elegant as possible, a minimal amount of complex helper functions. But I quickly learned this only slowed down the process for me, it was better to get it working, as to then find a way to size it down, and find smart rewrites. I really became overwhelmed with everything I wanted to add
#### `index.tsx`
This is just the homescreen when opening the app, I had first used it to display a preview of the widget, so I did not have to delete the cache of the app and drag the widget to the homescreen to see if the layout was correct with my vision. This was later removed, as it rendered no use. I instead made a quick welcome screen describing the app, with a button leading to the [configuration page](####configuretsx), making use of the expo router modal functionality, working similar to website URL's, but then inside the app. This was also the place where I got to play around a bit with the React Native syntax and styling. I had a lot of fun with the font and making it truly something of my own. 
### Widget:
Like before mentioned, I utilized the [React Native Android Widget library](https://saleksovski.github.io/react-native-android-widget/) to create the widget, and thanks to its awesome documentation it was a breeze. I did encounter a few obstacles though, but that was only because of my knowledge gap.  One problem for example was that the buttons werent functional, but that was because I was expecting for them to work in the preview version of the widget, it was not after a long time that I found out I had to drag the widget to my homescreen in order for the widget task handler to load. Another problem was the configuration of the plugin into Expo. I felt estranged with the syntax and all the parameters, as I apparently had used a different version of Expo base template compared to the one used in the documentation, which led to my project containing a different structure for root component rendering. Using a bit of basic reasoning I managed to fix it by creating a second index.tsx file, which imports and loads the previous entry script.
#### `widget-task-handler.tsx`
This file contains the wiring from the widget to the API. A big part of the code was directly taken from the widget library documentation, as it requires fixed variables and keys in order for it to work. The library has the ability to add different functionality if you were to have more than one widget (which I do not have), if you do, you have to write the code here
#### `widget.tsx`
This file lays out the structure and overall shape of the widget UI. The Android Widget library made this super simple by exporting custom components that work similar to tsx (and HTML in that regard). I first had to define the types as to avoid typescript yelling at me, I had to create a custom type/interface called task for all the properties I would like to display or use in the final widget:

```
interface Task {
  id: string;
  title: string;
  color: string;
  status: string;
}
```
In addition, I had to define 
For the layout I already had a design in mind, which I had drawn on paper to solidify the concept.
Because of a few Notion API limitations I had to look at the JSON response after querying for the pages. It turns out. And to make optimal use of the  

#### `app.config.ts`
This file contains all the widget parameters which will then get converted into native code for Android to understand. It contains the name, size, description, preview. Basically, the actual part that makes it able to add onto the homescreen. As I had used Expo to create this project, I had to define it as a plugin in order for it to have native functionality. The cool thing with Expo is that whenever I made a mistake or change a small feature, it can get updated automatically (hot reloading), without having to rebuild the entire project. 

### Notion:
#### `api.ts`
This file is basically the backbone of the entire project, and the most tiresome. I had to watch multiple videos and then had to find a way to tie it all together. To use the Notion API client (and our program), one must create a notion integration and link it to the database they would like to display. This integration has an API key which grants the keyholder access to all kinds of operations. To make the job a bit easier, the tutorial and I utilized the Notion software development kit so we did not have to struggle with the headers and payloads, generally providing a cleaner development experience. In order for us to access the database operations like querying, deleting and updating we must provide a Notion API key and Notion database ID, which we have obtained from the user through the [configuration screen](####configuretsx). We then have to "initialize" a Notion client object once from where we will operate all our functions from. The implemented functions perform simple CRUD operations and can be divided into the Creation of tasks, Reading of databases and the Updating of statuses (the deletion was not necessary for our goal).

The most important function being `getNotionContext`, on which all other functions rely on for the Notion credentials and client. Inside the API script, we first establish the global variables for the Notion client, and the Notion data. Whenever we want to perform an action for the first time, the file gets loaded into RAM and the global variable is empty, therefore our function retrieves the `NDATA` once, uses the Notion key from it to initialize the Notion client and stores it inside the global variables for future use. The second time an action requires the Notion context, this functions first checks if this is already inside of the global variables to use. This was the part of the code which I credit to AI, as I could have only found it with the help of AI. I was looking for a way to make the code more efficient and fast when I learned about Singletons, the principle of using only one single instance (in our case being the Notion client and data). Previously I had all functions initialize a new client and retrieve the `NDATA` for each action, which was slow for obvious reasons.

For the creation of tasks we made the function ``

Last but not least inside this file we also have the function `handleCheck`, which gets used by the configuration form upon saving to obtain the different status which we can cycle from, and in addition works as a check to report back any errors with the data inputted. We do this by starting a new Notion client with the `NDATA` information and retrieves the data for the property with the given status name.



Notion API , NotionData object
#### `configure.tsx`
This file has a form where the user can input the name of the properties inside of Notion from where they want to fetch the data. I was really 
Instead of fetching for the database properties and hardcoding some very sketchy logic for selecting which properties to show on my widget, I instead decided to give the user the. Later on I learned this was a classic choice between "user control" vs "user flexibility"
The way I created this was by utilizing the useState hook in React Native, which updates the variables and input boxes with every keystroke. I learned that a lot more logic goes into something as trivial as a simple form. Upon clicking the save button, the `saveData` function gets called. The function wraps the data into a big package/object:
```
NDATA = {
        NotionKey: NotionKey,     #Notion integration key
        NotionId: NotionId,       #Notion database ID
        Status: Status,           #Status property name in database
        Date: Date,               #Date property name in database
        Title: Title,             #Title property name in database
        Options: [] as string[],  #All the status options to cycle
      }
```
This them gets checked by the `handleCheck` function in the [api.ts](####apits) file. If the input data is sufficient, it then gets converted into JSON and stored in the app's memory using [the Asyncstorage library](https://github.com/react-native-async-storage/async-storage). 

"""""BRO TALK MORE ABOUT THE REAL CODE""""
</details>

 ## Final thoughts:
 The reason I chose this idea to create was because I wanted to create something I might use myself in the future. A productivity tool 
 I had just started my final year of highschool, which meant which was why this project was on hold for so long, but the voice in the back of my mind nagging me to finish what I had started never left. I knew I had already fought through the hardest part of the course (damn you, pointers!)
 I learned the importance of typesafety and error handling, always looking for a worstcase input.
 By building this project I got new insight on how to have a good relation with generative AI. When I had started this project, coding with AI was not as ubiquitous as it was now. Chatbots. But in a sense, I became much more involved with my project when AI did manage to get better, as it lowered the entry level and me not being stuck on the exact same bug from weeks upon a time. It taught me new techniques on efficient API calls and caching, which I otherwise could have never come up with. While developing, I used my own integration and API key for testing, but I made the rookie mistake of leaking this to the public on github, and I had a lot of trouble working with git to fix it. I eventually refreshed the integration key and learned about .env files, but this event thought me a bit about basic security.
