import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import TaskWidget from '../app/widget';
import { createTask, getPages, switchStatus } from '../services/api';

let pages: any[] = [];

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  TaskW: TaskWidget,
};


export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {

  const widgetInfo = props.widgetInfo;
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
      const currentDateRaw = props.clickActionData?.CurrentDate as string;
      const date = currentDateRaw ? new Date(currentDateRaw) : new Date();

      if (props.clickAction === 'DATECHANGE') {
        pages = await getPages(currentDateRaw);
        props.renderWidget(<Widget Tasks={pages} Datenow={date} />);

      } else if (props.clickAction === 'NEW') {
        await createTask(currentDateRaw);

      } else if (props.clickAction === 'STATUSSWITCH') {
        await switchStatus(props.clickActionData?.TaskID as string, props.clickActionData?.Status as string);
        pages = await getPages(currentDateRaw);
        props.renderWidget(<Widget Tasks={pages} Datenow={date} />);

      } else {
        pages = await getPages();
        props.renderWidget(<Widget Tasks={pages} />);
      }
      break;

    default:

      break;
  }
}