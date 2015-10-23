from PyQt4 import QtCore, QtGui
import qgmap_turtle as qgmap


class Ui_Maps( object ) :
	def setupMaps(self):
		#self.widget is the widget used for maps
		h = QtGui.QVBoxLayout(self.widget)
		l = QtGui.QFormLayout()
		h.addLayout(l)
		self.gmap = qgmap.QGoogleMap(self.widget)

		self.gmap.setSizePolicy(
			QtGui.QSizePolicy.MinimumExpanding,
			QtGui.QSizePolicy.MinimumExpanding)	

		self.gmap.waitUntilReady()

		self.gmap.centerAt(41.143,-8.651)
		self.gmap.setZoom(13)

		h.addWidget(self.gmap)


		self.gmap.add2Polyline(41.144,-8.645)