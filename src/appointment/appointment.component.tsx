import React, { useEffect, useState } from "react";
import { openmrsFetch } from "@openmrs/esm-api";

import resources from "./translations";
import { initI18n } from "../utils/translations";

import { CommonWidgetProps, Condition } from "../models";
import WidgetHeader from "../commons/widget-header/widget-header.component";
import WidgetFooter from "../commons/widget-footer/widget-footer.component";
import RefAppGrid from "../refapp-grid/refapp-grid.component";
import getAppointmentColumns from "./columns";

import { filterByConditions, compose } from "../utils";
import replaceParams from "../utils/param-replacers";
import constants from "../constants.json";

import globalStyles from "../global.css";

export default function Appointment(props: AppointmentProps) {
  initI18n(resources, props.locale, useEffect);
  const [appointments, setAppointments] = useState(null);
  const { showMessage, source, filters, title, viewAll = "" } = props;

  const fetchAppointmentsUrl = () =>
    replaceParams(`${source}/${constants.appointments.fetchUrl}`);

  const fetchAppointments = () => {
    openmrsFetch(fetchAppointmentsUrl()).then(response => {
      compose(
        setAppointments,
        formatAppointments
      )(response.data);
    });
  };

  const formatAppointments = fetchedAppointments => {
    const compareAppointments = (current, next) =>
      current[constants.appointments.sortBy] -
      next[constants.appointments.sortBy];
    fetchedAppointments.sort(compareAppointments);

    return filters
      ? filterByConditions(fetchedAppointments, filters)
      : fetchedAppointments;
  };

  useEffect(() => fetchAppointments(), []);

  const showLoading = () => <div>Loading...</div>;

  const showGrid = () => {
    return (
      <div className={globalStyles["widget-container"]}>
        <WidgetHeader
          title={title}
          icon="svg-icon icon-calender"
        ></WidgetHeader>
        <div className={globalStyles["widget-content"]}>
          <RefAppGrid
            data={appointments}
            columns={getAppointmentColumns(
              props.source,
              fetchAppointments,
              props.actions,
              showMessage
            )}
          ></RefAppGrid>
        </div>
        <WidgetFooter viewAllUrl={viewAll}></WidgetFooter>
      </div>
    );
  };

  return appointments ? showGrid() : showLoading();
}

type AppointmentProps = CommonWidgetProps & {
  source: string;
  viewAll?: string;
  filters?: Condition[];
  actions?: WidgetAction[];
};

type WidgetAction = {
  name: string;
  when: Condition[];
};
