import { StatusBar } from "expo-status-bar";
import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { Transaction } from "@ethersproject/transactions";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";

async function save(key, value) {
  console.log("saving: ", key, value);
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("fetching: ", key, result);
    return result.toString();
  } else {
    return "";
  }
}

async function deleteValueFor(key) {
  let result = await SecureStore.deleteItemAsync(key);
  console.log("deleting: ", key);
  if (result) {
    console.log("deleting: ", key);
    return result.toString();
  } else {
    return "";
  }
}

function WalletScreen() {
  const [toAddress, setToAddress] = useState("");
  const [value, setValue] = useState("");
  const [signedTransaction, setSignedTransaction] = useState("");

  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const [seedPhrase, setSeedPhrase] = useState("");
  const [writeSeedModal, setWriteSeedModal] = useState(false);

  useEffect(() => {
    async function fetchKeys() {
      setAddress(await getValueFor("oak-app-address"));
      setPrivateKey(await getValueFor("oak-app-private-key"));
      setMnemonic(await getValueFor("oak-app-mnemonic"));
    }
    fetchKeys();
  }, []);

  const deleteWallet = async () => {
    await deleteValueFor("oak-app-address");
    await deleteValueFor("oak-app-private-key");
    await deleteValueFor("oak-app-mnemonic");

    setAddress("");
    setPrivateKey("");
    setMnemonic("");
  };

  const configureWallet = async (useSeed) => {
    try {
      var wallet;
      if (useSeed) {
        console.log("importing wallet");
        wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      } else {
        console.log("creating wallet");
        wallet = ethers.Wallet.createRandom();
        setWriteSeedModal(!writeSeedModal);
      }
      // store wallet information in encrypted keychain
      const generatedAddress = await wallet.getAddress();
      await save("oak-app-address", generatedAddress);
      await save("oak-app-private-key", wallet.privateKey);
      await save("oak-app-mnemonic", wallet.mnemonic.phrase);

      // store wallet information in local state
      setAddress(await getValueFor("oak-app-address"));
      setPrivateKey(await getValueFor("oak-app-private-key"));
      setMnemonic(await getValueFor("oak-app-mnemonic"));

      if (useSeed) {
        console.log("successful wallet import");
      } else {
        console.log("successful wallet creation");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signTransaction = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const nonce = await wallet.getTransactionCount();
      const gasPrice = await wallet.provider.getGasPrice();
      const transaction = {
        to: toAddress,
        value: ethers.utils.parseEther(value),
        nonce,
        gasPrice,
        gasLimit: 21000,
      };
      const signedTx = await wallet.signTransaction(transaction);
      setSignedTransaction(signedTx);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMnemonicFromPhone = async () => {
    await deleteValueFor("oak-app-mnemonic");
    setMnemonic("");
    setWriteSeedModal(!writeSeedModal);
  };

  return (
    <View style={{ top: 100 }}>
      <Modal
        animationType="fade"
        transparent={false}
        visible={writeSeedModal}
        onRequestClose={() => setWriteSeedModal(!writeSeedModal)}
      >
        <View
          style={{
            top: 250,
            left: 70,
            alignItems: "center",
            justifyContent: "center",
            height: 500,
            width: 300,
            borderWidth: 4,
            borderColor: "#20232a",
          }}
        >
          <Text>
            A SERIOUS MESSAGE TO REMIND YOU TO WRITE THIS NMEONIC DOWN
          </Text>
          <Text>{mnemonic}</Text>
          <Button
            title="Write it down option"
            onPress={() => {
              deleteMnemonicFromPhone();
              setWriteSeedModal(!writeSeedModal);
            }}
          />
          <Button
            title="Lazy Button"
            onPress={() => setWriteSeedModal(!writeSeedModal)}
          />
        </View>
      </Modal>

      <View style={styles.container}>
        <Text>OAK CURRENCY</Text>

        <Button title="Create Wallet" onPress={() => configureWallet(false)} />
        {address !== "" && privateKey !== "" ? (
          <View>
            <Text>Address: {address}</Text>
            <Text>Mnemonic: {mnemonic}</Text>
          </View>
        ) : null}
        <Input
          label="Seed Phrase"
          placeholder="Input your Seed Phrase"
          value={seedPhrase}
          onChangeText={setSeedPhrase}
          autoCapitalize="none"
          secureTextEntry
        />
        <Button title="Import Wallet" onPress={() => configureWallet(true)} />
        <Button title="Delete Wallet" onPress={deleteWallet} />
        {/* <Input
      label="To Address"
      placeholder="Enter the recipient's address"
      value={toAddress}
      onChangeText={setToAddress}
      autoCapitalize="none"
    /> */}
        {/* <Input
      label="Value (ETH)"
      placeholder="Enter the amount to send"
      value={value}
      onChangeText={setValue}
      keyboardType="numeric"
    /> */}
        {/* <Button title="Sign Transaction" onPress={signTransaction} /> */}
        {signedTransaction ? (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>Signed Transaction:</Text>
            <Text selectable style={styles.resultValue}>
              {signedTransaction}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <WalletScreen />
      </View>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "start",
  },
});
