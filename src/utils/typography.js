import Typography from "typography"
import altonTheme from "typography-theme-alton"

const typography = new Typography({
  ...altonTheme,
  // headerColor: 'blue'
  overrideThemeStyles: () => ({
    // 'a:hover, a:active, a:focus': {
    //   color: 'blue',
    // },
  }),
})

export const { scale, rhythm, options } = typography
export default typography
