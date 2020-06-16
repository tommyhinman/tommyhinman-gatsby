import Typography from "typography"
import twinPeaksTheme from "typography-theme-twin-peaks"

const typography = new Typography({
  ...twinPeaksTheme,
  // headerColor: 'blue'
  overrideThemeStyles: () => ({
    // 'a:hover, a:active, a:focus': {
    //   color: 'blue',
    // },
  }),
})

export const { scale, rhythm, options } = typography
export default typography
