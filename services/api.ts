
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from "react-native";
const { Client } = require("@notionhq/client")

let _ctx: { notion: any; NDATA: any } | null = null;

const getNotionContext = async () => {
  if (_ctx) {
    return _ctx;
  }
  try {
    const jsonString = await AsyncStorage.getItem('NDATA');
    if (!jsonString) {
      console.error("No NDATA found in storage.");
      return null;
    }
    const { NotionKey, ...NDATA } = JSON.parse(jsonString || '{}');

    // Initialize the Notion Client with the user's key
    const notion = new Client({ auth: NotionKey });
    _ctx = { notion, NDATA };
    // Return the ready-to-use client AND the user's name
    return _ctx;

  } catch (error) {
    console.error("Error initializing Notion client:", error);
    return null;
  }
};

// const storeData = async (key: string, value: any) => {
//   try {
//     const jsonValue = JSON.stringify(value);
//     await AsyncStorage.setItem(key, jsonValue);
//   } catch (e) {
//     // saving error
//   }
// };

// const getData = async (key: string) => {
//   try {
//     const jsonValue = await AsyncStorage.getItem(key);
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (e) {
//     // error reading value
//   }
// };


//dont fetch the date bro
async function handleCheck() {
  const { notion, NDATA } = await getNotionContext() || {};
  try {
    const response = await notion.databases.retrieve({ database_id: NDATA.NotionId });
    
    console.log("Database properties: ", response.properties[NDATA.Status].status.options);

  } catch (error) {
    console.error("Error fetching database properties:", error);
    Alert.alert("Error", error as string || "An error occurred while fetching database properties.");
    throw error;
  }
};

async function switchStatus(TaskID: string) {
  const { notion, NDATA } = await getNotionContext() || {};
  try {
    const response = await notion.pages.update({
    page_id: TaskID,
    properties: {
      [NDATA.Status]: {
        status: {
          name: "✅"
        }
      },
    },
  });
  }
  catch (error) {
    console.error("Error switching status:", error);
    throw error;
  }
};

// function byId(properties: Record<string, any>) {
//   return Object.values(properties).reduce((obj, prop) => {
//     const { type, ...rest } = prop
//     return { ...obj, [type]: rest }
//   }, {});
// }

async function getPages(date: string = new Date().toISOString().slice(0, 10)): Promise<any[]> {
  const ctx = await getNotionContext();
  const { notion, NDATA } = ctx || {};

  try {
    const pages = await notion.databases.query({
      database_id: NDATA.NotionId,
      filter_properties: [NDATA.Status, NDATA.Title],
      filter: {
        property: NDATA.Date,
        date: {
          equals: date,
        } //check what they want from us, isostring?

      },
    });
    console.log("Only pages:", pages.results);
    console.log("Pages:", pages.results.map((page: any) => fromNotionobject(page, NDATA)));
    return pages.results.map((page: any) => fromNotionobject(page, NDATA));
  } catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
}

async function createTask(date: string) {
  const ctx = await getNotionContext();
  const { notion, NDATA } = ctx || {};
  try {
    const response = await notion.pages.create({
      parent: { database_id: NDATA.NotionId },
      properties: {
        [NDATA.Date]: {
          'date': { start: date },
        }
      }

    });
    await Linking.openURL(response.url);
  }
  catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
}

function fromNotionobject(notionpage: any, NDATA: any) {
  return {
    id: notionpage.id,
    title: notionpage.properties[NDATA.Title]?.title[0]?.plain_text || "",
    status: notionpage.properties[NDATA.Status]?.status?.name || "",
    color: notionpage.properties[NDATA.Status]?.status?.color || "",
  };
}


export { getPages, createTask, handleCheck, switchStatus };

//  LOG  Start of day: 2025-11-06T23:00:00.000Z
//  LOG  End of day: 2025-11-07T23:00:00.000Z
//  LOG  End of day: 2025-11-07T11:48:16.378Z
//  LOG  [{"color": "red", "description": null, "id": "46fc74d8-ec91-46b0-b171-abd5c13a165c", "name": "❌"}, {"color": "blue", "description": null, "id": "t[in", "name": "🔎"}, {"color": "green", "description": null, "id": "@jil", "name": "✅"}]
//  LOG  [{"color": "red", "description": null, "id": "46fc74d8-ec91-46b0-b171-abd5c13a165c", "name": "❌"}, {"color": "blue", "description": null, "id": "t[in", "name": "🔎"}, {"color": "green", "description": null, "id": "@jil", "name": "✅"}]
//  LOG  Pages: [{"color": "red", "date": "2025-11-07", "id": "2a4c0124-eb49-80d4-bbb0-e6cbfbd26de7", "status": "❌", "title": "notion widget tag storage"}, {"color": "red", "date": "2025-11-07", "id": "2a0c0124-eb49-8019-be17-dc9002128f1f", "status": "❌", "title": "Make the LED screen work"}]
//  LOG  Only pages: [{"archived": false, "cover": null, "created_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "created_time": "2025-11-28T23:46:00.000Z", "icon": null, "id": "2b9c0124-eb49-8105-a9e0-df1983f07341", "in_trash": false, "is_locked": false, "last_edited_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "last_edited_time": "2025-11-28T23:46:00.000Z", "object": "page", "parent": {"database_id": "e2d0e99f-f018-4d7a-98ed-6b58daac19b2", "type": "database_id"}, "properties": {"Date": [Object], "Name": [Object], "Status": [Object]}, "public_url": null, "url": "https://www.notion.so/Help-dage-gemini-2b9c0124eb498105a9e0df1983f07341"}, {"archived": false, "cover": null, "created_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "created_time": "2025-11-29T00:25:00.000Z", "icon": null, "id": "2bac0124-eb49-8034-8906-f85ea9c71589", "in_trash": false, "is_locked": false, "last_edited_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "last_edited_time": "2025-11-29T00:25:00.000Z", "object": "page", "parent": {"database_id": "e2d0e99f-f018-4d7a-98ed-6b58daac19b2", "type": "database_id"}, "properties": {"Date": [Object], "Name": [Object], "Status": [Object]}, "public_url": null, "url": "https://www.notion.so/Pinterest-clothed-2bac0124eb4980348906f85ea9c71589"}]