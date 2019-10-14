import format from "./formatters";

describe("formatters", () => {
  const mockDateTime = new Date(new Date().setHours(10)).setMinutes(30);
  it("should format given field with given formatter", () => {
    const source = {
      startDateTime: mockDateTime
    };
    const configs = [
      {
        name: "convertToTime",
        field: "startDateTime"
      }
    ];

    const formattedSource = format(source, configs);

    expect(formattedSource.startDateTimeFormatted).toEqual("10:30 AM");
  });

  it("should add formatted value to given new field", () => {
    const source = {
      startDateTime: mockDateTime
    };
    const configs = [
      {
        name: "convertToTime",
        field: "startDateTime",
        formattedField: "startTime"
      }
    ];

    const formattedSource = format(source, configs);
    expect(formattedSource.startTime).toEqual("10:30 AM");
  });

  it("should format value for nested field", () => {
    const source = {
      appointment: {
        startDateTime: mockDateTime
      }
    };
    const configs = [
      {
        name: "convertToTime",
        field: "appointment.startDateTime",
        formattedField: "startTime"
      }
    ];

    const formattedSource = format(source, configs);
    expect(formattedSource.appointment.startTime).toEqual("10:30 AM");
  });

  describe("convertToTime", () => {
    it("should extract Time with 12 hour type", () => {
      const source = {
        appointment: {
          startDateTime: mockDateTime
        }
      };
      const configs = [
        {
          name: "convertToTime",
          field: "appointment.startDateTime",
          formattedField: "startTime"
        }
      ];

      const formattedSource = format(source, configs);
      expect(formattedSource.appointment.startTime).toEqual("10:30 AM");
    });
  });

  describe("suffix", () => {
    it("should add given suffix to the field", () => {
      const source = {
        appointment: {
          durationInMins: "20"
        }
      };
      const configs = [
        {
          name: "suffix",
          field: "appointment.durationInMins",
          formattedField: "duration",
          args: [" mins"]
        }
      ];

      const formattedSource = format(source, configs);
      expect(formattedSource.appointment.duration).toEqual("20 mins");
    });
  });
});
