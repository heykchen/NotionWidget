import React from 'react';
import { FlexWidget, ListWidget, TextWidget } from 'react-native-android-widget';

interface Task {
  id: string;
  title: string;
  color: string;
  status: string;
}
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const COLOR_MAP: Record<string, string> = { red: '#e46666ff', green: '#60d460ff', blue: '#4c4ce7ff' };

const TestTasks: Task[] = [{
  id: '1',
  title: 'Task11',
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
}, {
  id: '4',
  title: 'Task 4',
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
        flexDirection: 'column',
        backgroundColor: '#333333',
        borderRadius: 16,
      }}
    >
      <ListWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          margin: 8,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 'match_parent',
            padding: 8,
            // marginBottom: 16,
          }}
        >
          <TextWidget
            text=" < "
            clickAction="DATECHANGE"
            clickActionData={{
              CurrentDate: [Datenow.getFullYear(), Datenow.getMonth(), Datenow.getDate()],
              Difference: -1
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
            text=" > "
            clickAction="DATECHANGE"
            clickActionData={{
              CurrentDate: [Datenow.getFullYear(), Datenow.getMonth(), Datenow.getDate()],
              Difference: 1
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
        {/* <ListWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#66756dff',
        }}> */}



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
              uri: `https://www.notion.so/${Task.title.replace(/\s+/g, '-')}-${Task.id.replace(/-/g, '')}`,
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
                  backgroundColor: (COLOR_MAP as any)[Task.color] ?? '#cccccc',
                  borderRadius: 100,
                  padding: 4,
                }}
                clickAction="STATUSSWITCH"
                clickActionData={{
                  TaskID: Task.id
                }}>

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
            CurrentDate: [Datenow.getFullYear(), Datenow.getMonth(), Datenow.getDate()]
          }}
        >
          <TextWidget text="+++" style={{ fontSize: 50, color: '#fff' }} />
        </FlexWidget>
      </ListWidget>
    </FlexWidget>
  );
}
