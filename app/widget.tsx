import React from 'react';
import { FlexWidget, ListWidget, TextWidget } from 'react-native-android-widget';


interface Task {
  id: string;
  title: string;
  color: string;
  status: string;
}
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function Stringtocolor(color: string) {
  switch (color) {
    case 'red':
      return '#ff0000';
    case 'green':
      return '#00ff00';
    case 'blue':
      return '#0000ff';
    default:
      return '#cccccc'; // fallback color
  }
}

const TestTasks: Task[] = [{
  id: '1',
  title: 'Task1',
  color: 'red',
  status: '🔥'
}, {
  id: '2',
  title: 'Task 2',
  color: 'green',
  status: '☘️'
}, {
  id: '3',
  title: 'Task 3',
  color: 'blue',
  status: '🫐'
}]



interface TaskWidgetProps {
  Tasks?: Task[];
  Datenow?: Date;
}

///FINAL WIDGET
export default function TaskWidget({ Tasks = TestTasks, Datenow = new Date() }: TaskWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#505050',
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingTop: 16,
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 16,
        }}
        clickAction="FORWARD"
        clickActionData={{
            CurrentDate: Datenow
          }}
      >
        <TextWidget
          text="<"
          clickAction="BACKWARD"
          clickActionData={{
            CurrentDate: Datenow
          }}
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#fff',
            backgroundColor: '#707070',
            padding: 8,
            borderRadius: 12,
          }}
        />
        <TextWidget
          text={`${Datenow.getDate() + " " + days[(Datenow?.getDay() ?? 0)]}`}
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#fff',
          }}
        />
        <TextWidget
          text=">"
          clickAction="FORWARD"
          clickActionData={{
            CurrentDate: Datenow
          }}
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#fff',
            backgroundColor: '#707070',
            padding: 8,
            borderRadius: 12,
          }}
        />
      </FlexWidget>
      <ListWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#66756dff',
        }}>

        

        {Tasks.map((Task: Task, i) => (
        <FlexWidget ///TASK LIST
          style={{
            width: 'match_parent',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          key={i}
          clickAction="OPEN_URI"
          clickActionData={{
            uri: `androidwidgetexample://list/list-demo/${Task.id}`,
          }}
        >
          <FlexWidget
            style={{
              width: 'match_parent',
              backgroundColor: '#4d4d4d',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingVertical: 4,
              paddingHorizontal: 4,
              marginVertical: 2,
              borderRadius: 100,
            }}
          >
            <FlexWidget  ///STATUS DOT
            style={{
                  backgroundColor: `${Stringtocolor(Task.color)}`,
                  borderRadius: 100,
                  padding: 4,
                }}
                clickAction="STATUSSWITCH"
                clickActionData={{
                  TaskID: Task.id}}>
                  
              <TextWidget
                text={`${Task.status}`}
                style={{
                  fontSize: 15,
                }}
                truncate="END"
                maxLines={1}
              />
            </FlexWidget>
            <TextWidget ///TITLE
              text={`${Task.title}`}
              style={{
                fontSize: 16,
                color: '#ffffff',
                fontWeight: '500',
              }}
              truncate="END"
              maxLines={1}
            />
            <TextWidget ///TIME
              text={`${Task.color}`}
              style={{
                fontSize: 12,
                color: '#ffffff',
              }}
            />
          </FlexWidget>
        </FlexWidget>
      ))}
        <FlexWidget ///ADD NEW TASK TO DATE
          style={{
            width: 'match_parent',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingTop: 0,
            paddingBottom: 0,
          }}
          clickAction="NEW"
          clickActionData={{
            CurrentDate: Datenow
          }}
        >
          <TextWidget text="+" style={{ fontSize: 50, color: '#fff' }} />
        </FlexWidget>
      </ListWidget>
    </FlexWidget>
  );
}
