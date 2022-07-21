import { log } from '../common/functions.js';
import { samples } from './samples.js';
export default {};
export { getVersionTwoTestProject };

function getVersionTwoTestProject() {
  log('getVersionTwoTestProject', 'start');
  // let testGlyphShapes = samples.glyphBox.shapes;
  const versionTwoTestProject = {
    projectSettings:{
      name:'Alpha Test Font',
      versionName:'Version 2 Alpha',
      version:'2.0.0',
      initialVersion:'2.0.0',
    },

    metadata:{
      font_family:'Alpha Test'
    },

    glyphs:{
      '0x0041':{
        id:'0x0041',
        objType:'Glyph',
        name:'Latin Capital Letter A',
        glyphWidth:530, leftSideBearing:10, rightSideBearing:10,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:363.2, y:145}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:363.2, y:145}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:363.2, y:145}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:166.7, y:145}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:166.7, y:145}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:166.7, y:145}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:130, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:130, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:130, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:197, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:197, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:197, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:333, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:333, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:333, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:530, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:530, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:530, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:0}}, 'type':'symmetric'}
              ]
            },
          },
          {objType:'Shape', name:'Path 2', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:332.9, y:265}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:332.9, y:265}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:332.9, y:265}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:265, y:533}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:265, y:533}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:265, y:533}}, 'type':'corner'},
              {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:197.1, y:265}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:197.1, y:265}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:197.1, y:265}}, 'type':'symmetric'}
              ]
            },
          }
        ]
      },
      '0x0042':{
        id:'0x0042',
        objType:'Glyph',
        name:'Latin Capital Letter B',
        glyphWidth:385, leftSideBearing:false, rightSideBearing:false,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:339.9, y:397}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:366.6, y:410}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:366.6, y:384}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:325}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:356.7}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:325}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:80}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:80}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:35.8}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:305, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:349.2, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:305, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:133}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:133}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:133}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:327}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:327}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:327}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:460}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:460}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:460}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:645}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:645}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:645}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:305, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:305, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:349.2, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:710}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:754.2}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:710}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:469}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:469}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:385, y:437.3}}, 'type':'flat'}
              ],
            },
          },
          {objType:'Shape', name:'Path 2', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:460}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:460}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:460}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:460}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:460}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:460}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:469}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:469}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:469}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:549.1}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:549.1}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:549.1}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:645}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:645}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:645}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:645}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:645}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:645}}, 'type':'symmetric'}
              ]
            },
          },
          {objType:'Shape', name:'Path 3', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:133}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:133}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:133}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:133}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:133}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:133}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:249.1}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:249.1}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:249.1}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:325}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:325}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:325}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:327}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:327}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:250, y:327}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:327}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:327}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:140, y:327}}, 'type':'symmetric'}
              ]
            },
          }
        ]
      },
      '0x0043':{
        id:'0x0043',
        objType:'Glyph',
        name:'Latin Capital Letter C',
        glyphWidth:400, leftSideBearing:false, rightSideBearing:false,
        shapes:[
          {objType:'Shape', name:'Path 1', 'path':
            {objType:'Path',
              pathPoints:[
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:540}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:540}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:540}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:645}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:645}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:645}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:645}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:645}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:645}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:145}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:145}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:145, y:145}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:145}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:145}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:145}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:250}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:250}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:260, y:250}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:250}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:250}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:250}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:80}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:80}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:35.8}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:320, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:364.2, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:320, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:80, y:0}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:80, y:0}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:35.8, y:0}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:80}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:35.8}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:80}}, 'type':'flat'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:710}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:710}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:0, y:754.2}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:80, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:35.8, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:80, y:790}}, 'type':'flat'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:320, y:790}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:320, y:790}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:364.2, y:790}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:710}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:754.2}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:710}}, 'type':'corner'},
                {objType:'PathPoint', 'p':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:540}}, 'h1':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:540}}, 'h2':{objType: 'ControlPoint', coord:{objType:'Coord', x:400, y:540}}, 'type':'symmetric'}
              ]
            }
          }
        ]
      }
    }
  };

  log(versionTwoTestProject);
  log('getVersionTwoTestProject', 'end');
  return versionTwoTestProject;
}
