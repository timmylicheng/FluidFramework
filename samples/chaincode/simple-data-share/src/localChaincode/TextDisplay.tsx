/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, PrimedComponentFactory } from "@microsoft/fluid-aqueduct";
import { IComponentHTMLVisual } from "@microsoft/fluid-component-core-interfaces";
import { Counter } from "@microsoft/fluid-map";
import * as React from "react";
import * as ReactDOM from "react-dom";

const pkg = require("../../package.json");
const chaincodeName = pkg.name;

/**
 * The TextDisplay does not directly manage or modify content. 
 * It simply takes in a counter, subscribes and displays changes to that counter.
 */
export class TextDisplay extends PrimedComponent implements IComponentHTMLVisual {
  public get IComponentHTMLVisual() { return this; } 

  public static readonly chaincodeName = chaincodeName + "/textDisplay";
  public counter: Counter;

  public render(div: HTMLDivElement) {
    // this.counter should be set by the root component. If it isn't defined yet, just return
    if (this.counter) {
      ReactDOM.render(
        <TextDisplayView counter={this.counter} />,
        div
      );
    } else {
      alert("No counter provided to the TextDisplay");
      return;
    }
  }
}

interface p {
  counter: Counter
}

interface s {
  value: number
}

/**
 * A React Component that displays the value of the counter
 * This also subscribes to changes on the value so it can update its state
 */
class TextDisplayView extends React.Component<p, s> {
  constructor(props: p) {
    super(props);

    this.state = {
      value: this.props.counter.value
    }
  }
  componentDidMount() {
    // Set a listener that triggers a re-render when the value is incremented
    this.props.counter.on("incremented", () => {
      this.setState({ value: this.props.counter.value })
    });
  }

  render() {
    return <span>{this.state.value}</span>;
  }
}

export const TextDisplayInstantiationFactory = new PrimedComponentFactory(
  TextDisplay,
  [],
);
