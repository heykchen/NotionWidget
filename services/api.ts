
const { Client } = require("@notionhq/client")
export const NAPI = {
  NAPIKEY: process.env.EXPO_PUBLIC_NOTION_API_KEY,
  NAPIDBID: process.env.EXPO_PUBLIC_NOTION_DATABASE_KEY,
}

const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
console.log("Start of day:", startOfDay.toISOString());
console.log("End of day:", endOfDay.toISOString());
console.log("End of day:", today.toISOString());

if (!NAPI.NAPIKEY || !NAPI.NAPIDBID) {
  throw new Error("Environment variables NOTION_API_KEY and NOTION_API_DATABASE_ID must be set.");
}
const notion = new Client({
  auth: NAPI.NAPIKEY,
})
async function getPropIDs(databaseId: string) {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
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
    return {...obj, [type]: rest }
    }, {});
}

async function getPages(databaseId: string) {
  const props = await getPropIDs(databaseId);
  const dateId = props.date?.id;
  const statusId = props.status?.id; 


  try {
    const pages = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: statusId, direction: "ascending" }],
      filter_properties: [props.status?.id, props.date?.id, props.title?.id],
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
    console.log("Pages:", pages.results.map(fromNotionobject));
    return pages.results.map(fromNotionobject);
  } catch (error) {
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
    date: propbyid.date?.date?.start || "",
  };
}
getPages(NAPI.NAPIDBID)
getPropIDs(NAPI.NAPIDBID)