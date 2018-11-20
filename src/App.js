import {
  createDrawerNavigator,
  createAppContainer,
} from 'react-navigation'

import Backlog from './screens/Backlog'
import Sprint from './screens/Sprint'


const Drawer = createDrawerNavigator(
  {
    Backlog: { screen: Backlog },
    Sprint: { screen: Sprint },
  },
  {
    initialRouteName: 'Backlog',
  },
)

const App = createAppContainer(Drawer)

export default App
