#!/usr/bin/python3.4
from interface_design import Ui_MainWindow
from PyQt4 import QtCore, QtGui
import qgmap_turtle as qgmap
from threading import Thread 
import time
import sys
import socket
import rospy
from sensor_msgs.msg import NavSatFix
import queue
import random
import pyqtgraph as pg

import math

#mensagem do kvh
from ins_kvh.msg import InsKvh
import numpy as np

lat_queue = queue.Queue(maxsize= 1000)
lon_queue = queue.Queue(maxsize= 1000)


class MainWindow(QtGui.QMainWindow, Ui_MainWindow ):
	def __init__(self):
		QtGui.QMainWindow.__init__(self)

		
		
		# Flag: Is the first coord readed from ROS?
		self.first_coord = 1

		# Latitude, Longitude and Rotation to be filled in a ROS CallBack
		self.lat = 0
		self.lon = 0
		self.rotation = 0
		self.attitude = []
		self.velocity_ned = []
		self.ros_update = 0


		# Setup interface, Maps and Timer
		self.setupUi(self)
		self.setupMaps()
		self.setupTimer()

		#Start the Ros (Subscribing) Node
		self.updateMap_node()
		
		
		#Connect Event to a function
		self.pushButton.clicked.connect(self.pushButton_clicked)
		

		self.setupLabels()



	def setupLabels(self):
		self.label.setText("Gps:")
		self.label_3.setText("Attitude:")
		self.label_5.setText("Velocity:")
		self.label_7.setText("Angular Velocity:")

		#self.checkBox.setText("rad")

		# w = self.widget_5
		
		# plot = pg.PlotWidget()

		
		# layout = QtGui.QGridLayout()
		# w.setLayout(layout)

		# layout.addWidget(plot)




	def pushButton_clicked(self):
		self.gmap.add2Polyline( random.uniform(40, 50) , random.uniform(-5, -8))



# Setup Google Maps inside a widget

	def setupMaps(self):
		#self.widget is the widget used for maps
		w = self.widget
		h = QtGui.QVBoxLayout(w)
		l = QtGui.QFormLayout()
		h.addLayout(l)

		self.gmap = qgmap.QGoogleMap(w)

		self.gmap.setSizePolicy(
			QtGui.QSizePolicy.MinimumExpanding,
			QtGui.QSizePolicy.MinimumExpanding)	

		self.gmap.waitUntilReady()

		self.gmap.centerAt(41.143,-8.651)
		self.gmap.setZoom(18)

		h.addWidget(self.gmap)

		self.gmap.addMarker("turtle",self.lat, self.lon, **dict(
			draggable=False,
			title = "turtle",
			rotation = 0
			))


		


#ROS Node

	def updateMap_node(self):

		#self.sub_Pos =  rospy.Subscriber('/fix', NavSatFix, self.updateMap)
		rospy.init_node('actu__', anonymous=True)
		#rate = rospy.Rate(10)

		self.sub_Kvh = rospy.Subscriber('/Kvh', InsKvh, self.updateMap)





#Main Window close event

	def closeEvent(self, event):
		self.kill_thread = 1
		sys.exit()
		


# ROS CallBack

	def updateMap(self, message):
		#Message in rad
		# self.lat = message.latitude
		# self.lon = message.longitude

		#Message in degrees
		self.lat = math.degrees(message.latitude)
		self.lon = math.degrees(message.longitude)
		self.rotation = math.degrees(message.attitude[2])
		self.attitude = message.attitude
		self.velocity_ned = message.velocity_ned
		self.angular_velocity = message.angular_velocity
		self.ros_update = 1
		print(message)



#Setup QTimer
	def setupTimer(self):
		self.timers = []
		timer = QtCore.QTimer()
		timer.timeout.connect(self.timer_func)
		
		#Timer Period in miliseconds
		timer.start(100)

		self.timers.append(timer)


#Fucntion to run at every Tic of the Timer
	def timer_func(self):



		#if self.lat != 0 and self.lon !=  0: 
		if self.ros_update == 1:
			self.ros_update = 0
			self.gmap.add2Polyline( self.lat , self.lon)
			self.gmap.centerAt(self.lat, self.lon)
			self.gmap.moveMarker('turtle', self.lat, self.lon, self.rotation)

			self.label_2.setText(("{:.6f} {:.6f}").format((self.lat),(self.lon)))
			self.attitude = [math.degrees(x) for x in self.attitude]
			self.label_4.setText(("R: {:.6f} P: {:.6f} Y: {:.6f}").format(self.attitude[0], self.attitude[1], self.attitude[2]) )		

			self.label_6.setText(("N: {:.6f} E: {:.6f} D: {:.6f}").format(self.velocity_ned[0], self.velocity_ned[1], self.velocity_ned[2]) )
			self.label_8.setText(("{:.6f} {:.6f} {:.6f}").format(self.angular_velocity[0], self.angular_velocity[1], self.angular_velocity[2])) 
			




def main(argv):

	app = QtGui.QApplication(sys.argv)
	window = QtGui.QMainWindow()
	ui = MainWindow()

	ui.showMaximized()
	sys.exit(app.exec_())




if __name__ == "__main__":
	main(sys.argv)



