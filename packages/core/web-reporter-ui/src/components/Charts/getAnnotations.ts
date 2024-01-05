import { getColorPalette } from "../../theme/colors";
import { AnnotationInterval } from "./types";

const getAnnotationInterval = (annotationIntervalList: AnnotationInterval[]) => {
  const layout = annotationIntervalList?.map(({ y, y2, label, color }) => ({
    y,
    y2,
    borderColor: color,
    fillColor: color,
    opacity: 0.2,
    label: {
      borderColor: color,
      style: {
        color: "#fff",
        background: color,
      },
      text: label,
    },
  }));
  return layout;
};

const getVideoCurrentTimeAnnotation = () => {
  const palette = getColorPalette();
  const lastColor = palette[palette.length - 1];

  return [
    {
      x: 0,
      strokeDashArray: 0,
      borderColor: lastColor,
      label: {
        borderColor: lastColor,
        style: {
          color: "#fff",
          background: lastColor,
        },
        text: "Video",
        position: "right",
      },
    },
  ];
};

export const getAnnotations = (annotationIntervalList: AnnotationInterval[] | undefined) => {
  if (!annotationIntervalList) return;

  const xaxis = getVideoCurrentTimeAnnotation();
  const yaxis = getAnnotationInterval(annotationIntervalList);
  if (!xaxis.length || !yaxis.length) return undefined;

  return { xaxis, yaxis };
};
