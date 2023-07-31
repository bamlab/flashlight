type Result = {
  result: {
    node: {
      row: Row[];
    };
  };
};

type Row = {
  sampleTime: NumberField;
  thread: Thread | refField;
  process: Process | refField;
  core: StringField | refField;
  threadState: StringField | refField;
  cycleWeight: NumberField | refField;
  backtrace: Backtrace | refField;
};

type refField = {
  ref: number;
};

const isRefField = (
  field: Thread | Process | StringField | NumberField | Backtrace | refField
): field is refField => {
  return "ref" in field;
};

type SampleTime = {
  id: number;
  fmt: string;
  value: number;
};

type Thread = {
  id: number;
  fmt: string;
  tid: NumberField;
  process: Process;
};

type Process = {
  id: number;
  fmt: string;
  pid: NumberField;
  deviceSession: StringField;
};

type StringField = {
  id: number;
  fmt: string;
  value: string;
};

type NumberField = {
  id: number;
  fmt: string;
  value: number;
};

interface Backtrace {
  id: number;
  fmt: string;
  process: Process;
  textAddresses: TextAddresses[];
}

interface TextAddresses {
  id: string;
  fmt: string;
  value: string[];
}

export {
  Result,
  Row,
  refField,
  SampleTime,
  Thread,
  Process,
  StringField,
  NumberField,
  Backtrace,
  TextAddresses,
  isRefField,
};
