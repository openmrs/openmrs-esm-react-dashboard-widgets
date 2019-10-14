import React from "react";

import RefAppGrid from "./refapp-grid.component";
import { render } from "@testing-library/react";

describe("Refapp-Grid", () => {
  it("should show grid with columns", () => {
    const simpleColumns = [
      {
        cells: [
          {
            field: "name",
            type: "label"
          }
        ]
      }
    ];
    const mockData = [
      {
        name: "test name"
      }
    ];

    const { getByText, container } = render(
      <RefAppGrid columns={simpleColumns} data={mockData} />
    );

    expect(container.getElementsByClassName("ReactTable").length).toEqual(1);
    expect(getByText("test name")).toBeTruthy();
  });
});
