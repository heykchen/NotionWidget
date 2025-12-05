import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import  TaskWidget  from '../app/widget';
import { createTask, getPages } from '../services/api';

let pages: any[] = [];
console.log('Widghet Task Handler Loaded');

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  TaskW: TaskWidget,
};


export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  
  console.log('WTH invoked:', props.widgetAction, 'clickAction=', props.clickAction);
  console.log('widgetInfo:', JSON.stringify(props.widgetInfo));
  const widgetInfo = props.widgetInfo;
  console.log('widget name:', widgetInfo.widgetName);
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget] as any;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      pages = await getPages();
      props.renderWidget(<Widget Tasks={pages} />);
      break;

    case 'WIDGET_UPDATE':
      pages = await getPages();
      props.renderWidget(<Widget Tasks={pages} />);
      break;

    case 'WIDGET_RESIZED':
      pages = await getPages();
      props.renderWidget(<Widget Tasks={pages} />);
      break;

    case 'WIDGET_DELETED':
      // Handle widget deleted (remove widget data if you stored it somewhere)
      break;

    case 'WIDGET_CLICK':
      console.log('Widget clicked, action:', props.clickAction, props.clickActionData);
      if (props.clickAction === 'DATECHANGE') {
        const currentDateRaw = props.clickActionData?.CurrentDate as number[];
        const date = currentDateRaw ? new Date(currentDateRaw[0], currentDateRaw[1], currentDateRaw[2]) : new Date();
        const pages = await getPages(date);
        props.renderWidget(<Widget Tasks={pages} Datenow={date} />); 
        
      } else if (props.clickAction === 'NEW') {
        const currentDateRaw = props.clickActionData?.CurrentDate as number[];
        const date = currentDateRaw ? new Date(currentDateRaw[0], currentDateRaw[1], currentDateRaw[2]) : new Date();
        await createTask(date);
        const pages = await getPages(date);
        props.renderWidget(<Widget Tasks={pages} Datenow={date} />);
      
      } else {
        props.renderWidget(<Widget/>);
      }
      break;

    default:

      break;
  }
}