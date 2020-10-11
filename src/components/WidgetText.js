import React from "react";

export default function WidgetText(props) {
  return (
    <div className="widget-wrap">
      <div className="widget-title">
        <h2>{props.title}</h2>
      </div>
      <div className="widget-value">
        <div className="value">{props.value}</div>
        <div className="description">{props.description}</div>
      </div>
    </div>
  );
}
