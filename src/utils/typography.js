import Typography from "typography"
import lincolnTheme from "typography-theme-lincoln"

const typography = new Typography({
  ...lincolnTheme,
  // headerColor: 'blue'
  overrideThemeStyles: () => ({
    // 'a:hover, a:active, a:focus': {
    //   color: 'blue',
    // },
  }),
})

export const { scale, rhythm, options } = typography
export default typography
