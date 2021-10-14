import * as Network from "expo-network";

const checkNetworkConnection = async () => {
  return Network.getNetworkStateAsync().then((res) => res.isInternetReachable);
};

export default checkNetworkConnection;
