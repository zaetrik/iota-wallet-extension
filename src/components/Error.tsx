/** @jsxImportSource theme-ui */

const Error = ({ error }: { error?: string }) => {
  return error ? <p sx={{ fontSize: 1 }}>{error}</p> : <></>;
};

export default Error;
