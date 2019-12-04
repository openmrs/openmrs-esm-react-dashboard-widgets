import React from "react";
import { todo as constants } from "../constants.json";

import defaultTodoColumns from "./config";
import buildColumn from "../refapp-grid/column-builder";
import styles from "./todo.css";

import { Trans } from "react-i18next";
import { markTodoAsDone } from "./todo.resource";

export default function getColumns(refreshTodos, showMessage, baseUrl) {
  const markTodoDone = (refreshTodos, showMessage, todo) => {
    const handleResponse = response => {
      if (response.ok) {
        showMessage({
          type: "success",
          message: <Trans>{constants.TODO_DONE_SUCCESS_MESSAGE}</Trans>
        });
        refreshTodos();
      } else {
        response.json().then(err => {
          showMessage({
            type: "error",
            message: <Trans>{constants.TODO_DONE_ERROR_MESSAGE}</Trans>
          });
          console.log(err); // eslint-disable-line no-console
        });
      }
    };

    markTodoAsDone(todo, baseUrl).then(handleResponse);
  };

  const getMarkDoneActionColumn = (refreshTodos, showMessage) => {
    const getMarkDoneActionButton = todo => {
      return (
        <button
          data-testid="submit"
          className={styles["mark-done"]}
          onClick={() => markTodoDone(refreshTodos, showMessage, todo)}
        >
          <i className={"icon-ok"}></i>
        </button>
      );
    };
    return {
      id: "markDoneButton",
      accessor: getMarkDoneActionButton
    };
  };

  const getTodoActionColumn = () => {
    const fetchEncounterURL = (patientId, encounterId) =>
      `${constants.PRINT_CONSENT_FORM_URL}patientId=${patientId}&encounter=${encounterId}`;

    const printConsentButton = todo => (
      <a href={fetchEncounterURL(todo.patient.id, todo.encounterId)}>
        <button className="task button small-button">
          <i className="icon-print" />
          <Trans>Print</Trans>
        </button>
      </a>
    );

    const getTodoActionButton = todo => {
      switch (todo.type) {
        case "PRINT_CONSENT":
          return printConsentButton(todo);
      }
    };
    return {
      id: "todoAction",
      accessor: getTodoActionButton
    };
  };

  const defaultColumns = defaultTodoColumns.columns.map(columnConfig =>
    buildColumn(columnConfig)
  );

  return [
    getMarkDoneActionColumn(refreshTodos, showMessage),
    ...defaultColumns,
    getTodoActionColumn()
  ];
}
