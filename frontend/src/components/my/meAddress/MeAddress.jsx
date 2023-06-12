import React, { useEffect, useRef, useState } from "react";
import "./meAddress.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../loader/Loader";

import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  deleteAddress,
  updateAddress,
} from "../../../redux/toolkits/userSlice";
const MeAddress = () => {
  const dispatch = useDispatch();
  let isAuthenticated = localStorage.getItem("isAuthenticated");

  const {loading} = useSelector(state => state.userState)

  const [arrayMaker, setArrayMaker] = useState([]);

  const [showPopup, setShowPopup] = React.useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); //refresh api
  const [address, setAddress] = useState("");
  const [nameAddress, setNameAddress] = useState("");
  const inputRef = useRef(null);
  const toggleAddressRef = useRef(null);
  const [viewport, setViewport] = useState({
    width: "100vh",
    height: "500px",
    //10.825684050290723, 106.72749915290312
    latitude: 10.825684050290723,
    longitude: 106.72749915290312,
    bearing: 0,
    pitch: 0,
    center: {
      lat: 10.825684050290723,
      lng: 106.72749915290312,
    },
    zoom: 11,
  });

  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const [addressArray, setAddressArray] = useState([]);

  const [addressDefault, setAddressDefault] = useState("");

  // get user address and user default address
  useEffect(() => {
    const getUsers = async () => {
      const access_token =
        "pk.eyJ1Ijoibmd1eWVuZGluaG5naGlhIiwiYSI6ImNsMnY4MW04eDA5ZnYza3BmMHIwc2s3MTkifQ.1UuutqBQD_tzSMH9g-K_xA";
      if (isAuthenticated) {
        try {
          await dispatch(getUser())
            .unwrap()
            .then((users) => {
              setAddressArray(users.user.address);
              setAddressDefault(users.user.address);
              let response = users.user.address;
              let arrayValueForMaker = [];
              response.map((add, i) => {
                axios
                  .get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${add}.json?limit=2&access_token=${access_token}`
                  )
                  .then((response) => {
                    arrayValueForMaker.push({
                      add,
                      latitude: response.data.features[0].center[1],
                      longitude: response.data.features[0].center[0],
                    });
                  });
              });
              setArrayMaker(arrayValueForMaker);
              return {
                response: users.user.address[0],
                allResponse: users.user.address,
              };
            })
            .then(async (response) => {
              const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${response.response}.json?limit=2&access_token=${access_token}`
              );
              setViewport({
                ...viewport,
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
                center: {
                  lat: data.features[0].center[1],
                  lng: data.features[0].center[0],
                },
              });
              return response.allResponse;
            });
        } catch (err) {}
      }
      // if (addressDefault !== '') {
      //     const access_token = 'pk.eyJ1Ijoibmd1eWVuZGluaG5naGlhIiwiYSI6ImNsMnY4MW04eDA5ZnYza3BmMHIwc2s3MTkifQ.1UuutqBQD_tzSMH9g-K_xA'
      //     const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${addressDefault}.json?limit=2&access_token=${access_token}`)
      //     console.log(data.features);
      //     setViewport({ ...viewport, latitude: data.features[1].center[1], longitude: data.features[1].center[0], center: { lat: data.features[1].center[1], lng: data.features[1].center[0] } })
      // }
    };
    getUsers();
    setIsLoading(true);
  }, [refreshKey, isAuthenticated]);

  //get new viewport when searching
  const getViewport = async () => {
    if (address !== "") {
      const access_token =
        "pk.eyJ1Ijoibmd1eWVuZGluaG5naGlhIiwiYSI6ImNsMnY4MW04eDA5ZnYza3BmMHIwc2s3MTkifQ.1UuutqBQD_tzSMH9g-K_xA";
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=2&access_token=${access_token}`
      );
      if (data) {
        setViewport({
          ...viewport,
          latitude: data.features[0].center[1],
          longitude: data.features[0].center[0],
          center: {
            lat: data.features[0].center[1],
            lng: data.features[0].center[0],
          },
        });
        setCenter({
          lat: data.features[0].center[1],
          lng: data.features[0].center[0],
        });
        setNameAddress(data.features[0].text);
        setRefreshKey((oldv) => oldv + 1);
        setIsLoading(false);
      }
    } else {
      inputRef.current.focus();
      toast.error("Vui lòng nhập địa chỉ");
    }
  };

  //handle toggle appear list address
  const handleToggleListAddress = (e) => {
    toggleAddressRef.current.classList.toggle("show");
  };

  //handle delete an element from list address
  const handleDeleteAddress = async (addressDel) => {
    try {
      await dispatch(deleteAddress({ addressDel })).unwrap();
      toast.success("Địa chỉ vừa được xóa thành công");
      setRefreshKey((oldv) => oldv + 1);
    } catch (err) {
      toast.error("Địa chỉ vừa được xóa không thành công");
    }
  };

  //handle create an element into list address
  const handleCreateAddress = async () => {
    if (address !== "") {
      const access_token =
        "pk.eyJ1Ijoibmd1eWVuZGluaG5naGlhIiwiYSI6ImNsMnY4MW04eDA5ZnYza3BmMHIwc2s3MTkifQ.1UuutqBQD_tzSMH9g-K_xA";
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=2&access_token=${access_token}`
      );
      if (data.features.length > 0) {
        try {
          await dispatch(updateAddress({ address })).unwrap();
          toast.success("Địa điểm được thêm vào thành công");
          setAddress("");
          setRefreshKey((oldv) => oldv + 1);
        } catch (err) {}
      }
    } else {
      inputRef.current.focus();
      toast.error("Vui lòng nhập địa chỉ");
    }
  };
  return (
    <div className="col l-10 index__profile map-maker">
      <div className="index__profile--heading">
        <h1 className="index__profile--heading--item">Địa chỉ</h1>
      </div>
      <div className="index__profile--list__address">
        <div className="index__address-all">
          <button className="btn" onClick={handleToggleListAddress}>
            Sổ địa chỉ <i className="fa-solid fa-location-dot"></i>
          </button>
        </div>
        <ul ref={toggleAddressRef} className="index__address-all--list">
          {addressArray.length > 0 ? (
            addressArray.map((add, i) => (
              <li key={i} className="index__address-all--list-item">
                <span>{add}</span>
                <i
                  onClick={() => {
                    handleDeleteAddress(add);
                  }}
                  className="fa-solid fa-trash-can"
                ></i>
              </li>
            ))
          ) : (
            <li className="index__address-all--list-item">
              Không có địa chỉ nào
            </li>
          )}
        </ul>
      </div>
      <div className="index__profile--search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập vào địa chỉ..."
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <button onClick={handleCreateAddress} className="btn">
          Thêm địa chỉ <i className="fa-solid fa-plus"></i>
        </button>
        <button onClick={getViewport} className="btn">
          Tìm kiếm
        </button>
      </div>
      <div className="wrap-map">
        {isLoading ? (
          <Map
            attributionControl
            initialViewState={{ ...viewport, center: center }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken="pk.eyJ1Ijoibmd1eWVuZGluaG5naGlhIiwiYSI6ImNsMnY4MW04eDA5ZnYza3BmMHIwc2s3MTkifQ.1UuutqBQD_tzSMH9g-K_xA"
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />
            {showPopup && (
              <Popup
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                closeButton={false}
                closeOnClick={true}
                // onClose={() => setShowPopup(false)}
                draggable
                anchor="bottom"
              >
                {nameAddress ? nameAddress : ""}
              </Popup>
            )}
            {arrayMaker.map((add, i) => (
              <Marker
                key={i}
                draggable
                latitude={add.latitude}
                longitude={add.longitude}
                offsetLeft={-20}
                offsetTop={-30}
                center
                onDragEnd={(vt) => {
                  setViewport({
                    ...viewport,
                    latitude: vt.target._lngLat.lat,
                    longitude: vt.target._lngLat.lng,
                  });
                }}
              >
                <img
                  onClick={() => {
                    setShowPopup(true);
                  }}
                  style={{ height: 30, width: 30 }}
                  src="https://xuonginthanhpho.com/wp-content/uploads/2020/03/map-marker-icon.png"
                />
              </Marker>
            ))}
          </Map>
        ) : (
          <Loader />
        )}
      </div>
      {/* <Map
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                }}
                style={{ width: 600, height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />; */}
      {loading && <Loader />}
    </div>
  );
};

export default MeAddress;
