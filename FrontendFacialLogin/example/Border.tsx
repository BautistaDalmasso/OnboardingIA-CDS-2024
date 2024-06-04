import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Border(props: any) {
    return (
        <Svg
            width={430}
            height={932}
            viewBox="0 0 430 932"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M430 0H0v932h430V0zM215 592c75.111 0 136-88.2 136-197s-60.889-197-136-197c-75.111 0-136 88.2-136 197s60.889 197 136 197z"
                fill="#D9D9D9"
            />
        </Svg>
    )
}

export default Border
