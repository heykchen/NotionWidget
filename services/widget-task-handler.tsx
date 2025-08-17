import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import  TaskWidget  from '../app/widget';


console.log('Widghet Task Handler Loaded');
const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  TaskWidget: TaskWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  console.log('testtask', props)
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      console.log('testtask', props)
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
      console.log('Widget clicked, action:', props.clickAction);
      if (props.clickAction === 'FORWARD') {
        console.log('Widget clicked, FOWERRAD');
        props.renderWidget(<Widget Tasks={[]} Datenow={new Date(17-9-2007)} />);
      } else {
        console.log('Widget clicked, FOWERRAD');
        props.renderWidget(<Widget/>);
      }
      break;

    default:

      break;
  }
}