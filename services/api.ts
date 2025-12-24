
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from "react-native";
const { Client } = require("@notionhq/client")

let _ctx: { notion: any; NDATA: any } | null = null;

const getNotionContext = async () => {
  if (_ctx) {
    console.log("👍short");
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
    console.log("🔥🔥looong");
    // Return the ready-to-use client AND the user's name
    return _ctx;

  } catch (error) {
    console.error("Error initializing Notion client:", error);
    return null;
  }
};


//dont fetch the date bro
async function handleCheck(NDATA: any) {
  const notion = new Client({ auth: NDATA.NotionKey });
  try {
    const response = await notion.databases.retrieve({ database_id: NDATA.NotionId });
    return response.properties[NDATA.Status].status.options.map((o: Record<string, any>) => o.name);
  } catch (error) {
    throw error;
  }
};

async function switchStatus(TaskID: string, Status: string) {
  const { notion, NDATA } = await getNotionContext() || {};
  const Options = NDATA.Options;
  try {
    await notion.pages.update({
    page_id: TaskID,
    properties: {
      [NDATA.Status]: {
        status: {
          name: Options[((Options.indexOf(Status) + 1) % Options.length)]
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


async function getPages(date: string = new Date().toISOString().slice(0, 10)): Promise<any[]> {
  const { notion, NDATA } = await getNotionContext() || {};

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
    return pages.results.map((page: Record<string, any>) => fromNotionobject(page, NDATA));
  } catch (error) {
    console.error("Error fetching database:", error);
    throw error;
  }
}

async function createTask(date: string) {
  const { notion, NDATA } = await getNotionContext() || {};
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
    console.error("Error creating task:", error);
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
