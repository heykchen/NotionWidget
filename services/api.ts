
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from "react-native";
const { Client } = require("@notionhq/client")
export const NAPI = {
  NAPIKEY: process.env.EXPO_PUBLIC_NOTION_API_KEY,
  NAPIDBID: process.env.EXPO_PUBLIC_NOTION_DATABASE_KEY,
}


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


if (!NAPI.NAPIKEY || !NAPI.NAPIDBID) {
  throw new Error("Environment variables NOTION_API_KEY and NOTION_API_DATABASE_ID must be set.");
}
const notion = new Client({
  auth: NAPI.NAPIKEY,
})

//dont fetch the date bro
async function getPropIDs() {
  try {
    const response = await notion.databases.retrieve({ database_id: NAPI.NAPIDBID });
    console.log(byId(response.properties).status.status.options);
    return byId(response.properties);

  } catch (error) {
    console.error("Error fetching database properties:", error);
    throw error;
  }
}

function byId(properties: Record<string, any>) {
  return Object.values(properties).reduce((obj, prop) => {
    const { type, ...rest } = prop
    return { ...obj, [type]: rest }
  }, {});
}

async function getPages(date: Date = new Date()): Promise<any[]> {
  const props = await getPropIDs();
  const dateId = props.date?.id;
  const statusId = props.status?.id;
  const titleId = props.title?.id;
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);


  try {
    const pages = await notion.databases.query({
      database_id: NAPI.NAPIDBID,
      filter_properties: [statusId, titleId],
      filter: {
        and: [
          {
            property: dateId,
            date: {
              on_or_after: startOfDay.toISOString(),
            }
          },
          {
            property: dateId,
            date: {
              before: endOfDay.toISOString(),
            }
          }
        ],

      },
    });
    console.log("Only pages:", pages.results);
    console.log("Pages:", pages.results.map(fromNotionobject));
    return pages.results.map(fromNotionobject);
  } catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
}

async function createTask(date: Date) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: NAPI.NAPIDBID },
      properties: {
        'Date': {
          'date': {start: date.toISOString()},
        }
      }

    });
      await Linking.openURL(response.url);}
    catch (error) {
      console.error("Error fetching database:", error);
      throw error;
    }
  }

  function fromNotionobject(notionpage: any) {
    const propbyid = byId(notionpage.properties);
    return {
      id: notionpage.id,
      title: propbyid.title?.title[0]?.plain_text || "",
      status: propbyid.status?.status?.name || "",
      color: propbyid.status?.status?.color || "",
    };
  }
  getPages()
  getPropIDs()

  export { getPages, createTask };

//  LOG  Start of day: 2025-11-06T23:00:00.000Z
//  LOG  End of day: 2025-11-07T23:00:00.000Z
//  LOG  End of day: 2025-11-07T11:48:16.378Z
//  LOG  [{"color": "red", "description": null, "id": "46fc74d8-ec91-46b0-b171-abd5c13a165c", "name": "❌"}, {"color": "blue", "description": null, "id": "t[in", "name": "🔎"}, {"color": "green", "description": null, "id": "@jil", "name": "✅"}]
//  LOG  [{"color": "red", "description": null, "id": "46fc74d8-ec91-46b0-b171-abd5c13a165c", "name": "❌"}, {"color": "blue", "description": null, "id": "t[in", "name": "🔎"}, {"color": "green", "description": null, "id": "@jil", "name": "✅"}]
//  LOG  Pages: [{"color": "red", "date": "2025-11-07", "id": "2a4c0124-eb49-80d4-bbb0-e6cbfbd26de7", "status": "❌", "title": "notion widget tag storage"}, {"color": "red", "date": "2025-11-07", "id": "2a0c0124-eb49-8019-be17-dc9002128f1f", "status": "❌", "title": "Make the LED screen work"}]
//  LOG  Only pages: [{"archived": false, "cover": null, "created_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "created_time": "2025-11-28T23:46:00.000Z", "icon": null, "id": "2b9c0124-eb49-8105-a9e0-df1983f07341", "in_trash": false, "is_locked": false, "last_edited_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "last_edited_time": "2025-11-28T23:46:00.000Z", "object": "page", "parent": {"database_id": "e2d0e99f-f018-4d7a-98ed-6b58daac19b2", "type": "database_id"}, "properties": {"Date": [Object], "Name": [Object], "Status": [Object]}, "public_url": null, "url": "https://www.notion.so/Help-dage-gemini-2b9c0124eb498105a9e0df1983f07341"}, {"archived": false, "cover": null, "created_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "created_time": "2025-11-29T00:25:00.000Z", "icon": null, "id": "2bac0124-eb49-8034-8906-f85ea9c71589", "in_trash": false, "is_locked": false, "last_edited_by": {"id": "cb4d364e-aca4-486b-bd7f-2bac06f61c56", "object": "user"}, "last_edited_time": "2025-11-29T00:25:00.000Z", "object": "page", "parent": {"database_id": "e2d0e99f-f018-4d7a-98ed-6b58daac19b2", "type": "database_id"}, "properties": {"Date": [Object], "Name": [Object], "Status": [Object]}, "public_url": null, "url": "https://www.notion.so/Pinterest-clothed-2bac0124eb4980348906f85ea9c71589"}]