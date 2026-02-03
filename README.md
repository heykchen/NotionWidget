# Notion widget for Android 
![Notion widget icon](assets/images/splash-icon.png)

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

### 《Framework》:
For this project I used the React Native framework to create the app. I had watched a lot of reviews on frameworks, and ultimatly found React Native to be the most well documented and best long term skill to learn. However, I definitely was not ready for the journey ahead of me, as I have never touched a single line of HTML or Javascript before. When I say CS50 was my first experience with coding, it really was. In addition to using React Native I also made use of Expo, which is useful because of their hot reloading, that is, having it update the app automatically upon changing a small feature, without having to rebuild the entire project. 
This definitely was not possible without the [React Native Android Widget library](https://saleksovski.github.io/react-native-android-widget/) from Stefan Aleksoski.
  #### `index.tsx`
  This is just the homescreen when opening the app. First I had used it to display a preview of the widget so I did not have to delete the cache of the app and drag the widget to the homescreen to see if the layout was correct with my vision. This was later removed, as the buttons were not functional (which I painstakingly found out later). Instead I made a quick welcome screen describing the app, with a button leading to the [configuration page](#configuretsx), making use of the expo router modal functionality, working similar to website URL's but then inside the app. This was also the place where I got to play around a bit with the React Native syntax and styling. I had a lot of fun with the font and making the UI truly something of my own. 


### 《Widget》:
  #### `widget.tsx`
  This file lays out the structure and overall shape of the widget UI. For the layout I already had a design in mind, which I had drawn on paper to solidify the concept. Like before mentioned, I utilized the [React Native Android Widget library](https://saleksovski.github.io/react-native-android-widget/) to create the widget, and thanks to its awesome documentation it was a breeze, by exporting custom components that work similar to tsx (and HTML in that regard). I first had to define the types as to avoid typescript yelling at me, I had to create a custom type/interface called task for all the properties I would like to display or use in the final widget:

  ```
  interface Task {
    id: string;
    title: string;
    color: string;
    status: string;
  }
  ```
  In addition, I had to define the date the view is on. I wanted the widget to have two buttons navigating this date value, going forward and back one day. I made the buttons tell the [widget-task=handler.tsx](#widget-task-handlertsx) the new date in a format the fetching function understands. The date of the view is displayed with the day of the month and the day of the week (I simply found this to be best for planning), and clicking this defaults the view back to todays date.  Then there is the list containing the pages, which is actually scrollable, although a bit glitchy due to framework limitations. I adapted this partially from the demo given in the library, but the page item I made myself. Using the array containing the task objects, the widget creates a component with a status button and title using the corresponding data. Clicking this task item opens up the page in Notion, but as one can see, the task interface only contains the id and no link. I instead constructed the link using the id and title to avoid unnecessary duplicate data. The status button displays the status of the task with the corresponding background color it has in Notion. Upon clicking, the widget forwards the task id and current status to the [widget-task=handler.tsx](#widget-task-handlertsx) to cycle the status and refresh the view. 
  #### `widget-task-handler.tsx`
  This file contains the wiring from the widget to the API. A big part of the code was directly taken from the widget library documentation, as it requires fixed variables and keys in order for it to work. The library has the ability to add different functionality if you were to have more than one widget (which I do not have). The provided template contains a case switch for all the different widget states, for example: the moment a widget gets added, resized, updated, deleted and clicked. Most of these could be useful, but is not needed for our design.   Whenever the widget gets clicked, it also carries a `clickAction` property containing the users intention, which we have defined at [widget.tsx](#widgettsx). Like for when the date gets changed, the task handler will fetch the new dates using the `getPages` function in [api.ts](#apits) and rerender the widget. Or for when the user creates a new item, it calls `createTask` for that date. When the user wants to change the status of an item, we use a combination of `switchStatus` and `getPages`, in that order. Firstly, the status gets updated, afterwards, the new pages get fetched to display the updated status.
  #### `app.config.ts`
  This file contains all the widget parameters which will then get converted into native code for Android to interpret. It contains the name, size, description, preview and refreshrate. Basically, the actual part that makes it able to add onto the homescreen. As I had used Expo to create this project, I had to define it as a plugin in order for it to have native functionality. 

### 《Notion》:
  #### `api.ts`
  This file is basically the backbone of the entire project, and the most tiresome. I had to watch multiple videos and find a way to tie it all together. To use the Notion API client (and our program), one must create a notion integration and link it to the database they would like to display. This integration has an API key which grants the keyholder access to all kinds of operations. To make the job a bit easier, the tutorial and I utilized the Notion software development kit so we did not have to struggle with the headers and payloads, generally providing a cleaner development experience. In order for the code to access the database operations like querying, deleting and updating the user must provide a Notion API key, Notion database ID and property names. These we have obtained through the [configuration screen](#configuretsx). We then have to "initialize" a Notion client object once from where we will operate all our functions. The implemented functions perform simple CRUD operations and can be divided into the Creation of tasks, Reading of databases and the Updating of statuses (the deletion was not necessary for our goal).

  The most important function being `getNotionContext`, on which all other functions rely on for the Notion credentials and client. Inside the API script, we first establish the global variables for the Notion client and the Notion data. Whenever we want to perform an action for the first time, the file gets loaded into RAM and the global variable is empty, therefore our function retrieves the `NDATA` once, uses the Notion key from it to initialize the Notion client and stores them inside the global variables for future use.  The second time an action requires the Notion context, `getNotionContext` first checks if this is already inside of the global variables to use. This was the part of the code which I credit to AI, as I could have only found it with the help of AI. I was looking for a way to make the code more efficient and fast when I learned about Singletons, the principle of using only one single instance (in our case being the Notion client and data). Previously I had all functions initialize a new client and retrieve the `NDATA` for each action, which was slow for obvious reasons.

  For the creation of tasks we made the function `createTask`. This function takes the date the view of the widget is on and then calls `getNotionContext` for the Notion data. It will then send a POST request to create a page in the given Notion database, with that date as the date property. Do note that for all future functions the date parameters will only be in the IS8601 format without the time part (2025-12-30), as we want our views to only display the items on that day. The functions ends by opening the newly created page in Notion for you to type extra details.

  For reading of databases we have the functions `getPages` and `fromNotionobject`. `getPages` queries the database for the items on the given date. We receive a big array of all the page objects, but there is a lot of data which is unnecessary for our usecase, so we map over each object with the dedicated `fromNotionobject` function, formatting each item into something the widget can work with. By decreasing the amount of data that needs to be passed across files, I hoped to lower the processing time and efficiency.

  I had a little more trouble with writing the `switchStatus` function for the updating of statuses. I did not want the API to call for the options for every action, as these options would not change often. So I decided to add the options into the `NDATA` object to store locally, thus allowing it to also benefit from the reduced load time. I was lucky to find out that the options could be easily changed using only the name of the status, reducing the size of the object to store. Then, based on this options array, I made it choose the next one in the order (i.e. Do -> Doing -> Done)

  Last but not least inside this file we also have the function `handleCheck`, which gets used by the configuration form upon saving to obtain the different status which we can cycle from, and in addition works as a check to report back any errors with the data inputted. We do this by starting a new Notion client with the `NDATA` information and retrieves the data for the property with the given status name.

  #### `configure.tsx`
  This file has a form where the user can input the name of the properties inside of Notion from where they want to fetch the data. Instead of fetching for the database properties and hardcoding some very sketchy logic for selecting which properties to show on my widget, I instead decided to give the user the freedom to choose themselves. Later on I learned this was a classic choice between "user control" vs "user flexibility". The way I created this form was by utilizing the useState hook in React Native, which updates the variables and input boxes with every keystroke. I learned that a lot more logic goes into something as trivial as a simple form. Upon clicking the save button, the `saveData` function gets called. The function wraps the data into a big package/object:
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
  This then gets checked by the `handleCheck` function in the [api.ts](#apits) file. If the input data is sufficient, it then gets converted into JSON and stored in the app's memory using [the Asyncstorage library](https://github.com/react-native-async-storage/async-storage). 


</details>

## Final thoughts:
Across the project's timeline, I learned the importance of typesafety and error handling, always looking for a worstcase input. Online tutorials already brought me really far, but I had a hard time combing all these different concepts and libraries. What really helped for me was to draw the design I had in my head, with every button connected to a function that returned a certain value, across multiple files. I could then break this down into subtasks which I wrote in pseudocode. One thing I was really worried about was performance, I have always thought code should be written as elegant as possible and a minimal amount of complex helper functions. But I quickly learned this only slowed down the development process for me. It was better to get it working, as to then find a way to size it down, and find smart rewrites. I really became overwhelmed with everything I wanted to add. During the process I encountered a few obstacles though, but that was only because of my knowledge gap. One problem for example was that the buttons werent functional, but that was because I was expecting for them to work in the preview version of the widget, it was not after a long time that I found out I had to drag the widget to my homescreen in order for the widget task handler to load. Another challenge was configuring the plugin inside an Expo project. I felt quite estranged by the syntax and the parameters, especially because I had used a different Expo base template than the one shown in the documentation. This resulted in a different root component structure. Using some basic reasoning, I fixed this by creating a second index.tsx file, which imports and loads the previous entry script. While developing, I used my own integration and API key for testing, but I made the rookie mistake of leaking this to the public on github, and I had a lot of trouble working with git to fix it. I eventually refreshed the integration key and learned about .env files, but this event thought me a bit about basic security.
By building this project I got new insight on how to have a good relation with generative AI. When I had started this project, coding with AI was not as ubiquitous as it was now. Chatbots. But in a sense, I became much more involved with my project when AI did manage to get better, as it lowered the entry level and me not being stuck on the exact same bug from weeks upon a time. It taught me new techniques on efficient API calls and caching, which I otherwise could have never come up with.
The reason I chose this idea to create was because I wanted to create something I might use myself in the future. 
I had just started my final year of highschool, and I had no idea what major to choose when I enter University. That was why I enrolled in the CS50 course. But being a senior, also meant I had my final exams and entrance exam coming up, which also contributed to my decision to make a small productivity tool. However, the pressure increased, thus leading me to set this project on hold for so long, but the voice in the back of my mind, nagging me to finish what I had started, never left. I knew I had already fought through the hardest part of the course (damn you, pointers!), so it would be a shame to let the work go to waste. But in the end, I realised I had achieved so much more, this course being the turning point for me choosing to study Computer Science. Maybe the real Computer Science is the friends we have made along the way...
I am eternally grateful towards the people behind CS50 and Stefan Aleksoski! 💪

I do not plan on adding more crazy features, but I do have some ideas for if I do find myself revisiting this. For example adding a smaller button for displaying other Notion properties, or being able to customize the view of the widget. But in the mean time, I hope someone might find this project useful, because I certainly did!
