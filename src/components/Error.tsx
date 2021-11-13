/** @jsxImportSource theme-ui */

const Error = ({ error }: { error?: string }) => {
  return error ? <p>{error}</p> : <></>;
};

export default Error;
