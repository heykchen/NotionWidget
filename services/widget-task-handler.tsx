import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import  TaskWidget  from '../app/widget';


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
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Handle widget deleted (remove widget data if you stored it somewhere)
      break;

    case 'WIDGET_CLICK':
      console.log('Widget clicked, action:', props.clickAction, props.clickActionData);
      if (props.clickAction === 'DATECHANGE') {
        const currentDateRaw = props.clickActionData?.CurrentDate;
        let raw: number[] | undefined;
        raw = currentDateRaw as number[];
        const diff = Number(props.clickActionData?.Difference) || 0;
        let date = raw ? new Date(raw[0], raw[1], raw[2]) : new Date();
        date.setDate(date.getDate() + diff);
        props.renderWidget(<Widget Tasks={[]} Datenow={date} />);
      } else {
        props.renderWidget(<Widget/>);
      }
      break;

    default:

      break;
  }
}