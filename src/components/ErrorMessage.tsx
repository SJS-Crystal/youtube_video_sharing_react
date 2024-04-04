function ErrorMessage({ message }: { message: any }) {
  if (!message) {
    return null;
  }

  return <p className='error-message'>{message}</p>;
}
export default ErrorMessage;
