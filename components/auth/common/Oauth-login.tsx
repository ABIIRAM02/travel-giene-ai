const Oauth = () => {
  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <button className="shadow cursor-pointer py-2 w-full text-base rounded-full border border-gray-200">
          Google
        </button>
        <button className="shadow cursor-pointer py-2 w-full text-base rounded-full border border-gray-200">
          Apple
        </button>
      </div>
      <div className="flex items-center">
        <hr className="border flex-1" />
        <span className="px-4">OR WITH EMAIL</span>
        <hr className="border flex-1" />
      </div>
    </>
  );
};

export default Oauth;
